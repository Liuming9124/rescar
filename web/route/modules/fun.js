const db = require('./db');

async function getMenu(req) {
    const menu = [];
    let session = null;

    try {
        session = db.session();
        const result = await session.run('MATCH (n:type) RETURN n.name');

        result.records.forEach(record => {
            menu.push({ name: `${record.get('n.name')}`, items: [] });
        });
    } catch (error) {
        console.error('home type error:', error);
    } finally {
        if (session) {
            session.close();
        }
    }

    try {
        const session2 = db.session();

        for (let i = 0; i < menu.length; i++) {
            const tname = menu[i].name;
            const itemsarr = [];

            try {
                const results = await session2.run(`MATCH (t:type{name:'${tname}'})-[:own]->(i:item) RETURN i`);

                results.records.forEach(record => {
                    itemsarr.push(record.get('i').properties);
                });
            } catch (error) {
                console.error(error);
            }

            menu[i].items = itemsarr;
        }

        session2.close();
    } catch (error) {
        console.error('menu items error:', error);
    }

    // console.log('menu:', JSON.stringify(menu));

    return Promise.resolve(JSON.stringify(menu));
}

async function getDataFromNeo4j() {
    session = db.session();
    try {
        // Fetch the data from Neo4j
        const result = await session.run(`
            MATCH (r:Robot)-[:has]->(n:Kitchen),
                  (r)-[:has]->(b:Counter),
                  (r)-[:has]->(x:Map),
                  (r)-[:has]->(y:Table)
            RETURN x.x as mapX, x.y as mapY, x.flatMaps as flatMaps,
                   n.x as kitchenX, n.y as kitchenY,
                   b.x as counterX, b.y as counterY,
                   collect({x: y.x, y: y.y, tableNumber: y.tableNumber}) as tables
        `);

        // Extract the data from the result
        const data = {
            maps: [],
            location: {
                counter: [],
                kitchen: [],
                table: {}
            }
        };

        if (result.records.length > 0) {
            const record = result.records[0];
            const mapX = record.get('mapX');
            const mapY = record.get('mapY');
            const flatMaps = record.get('flatMaps');
            const kitchenX = record.get('kitchenX');
            const kitchenY = record.get('kitchenY');
            const counterX = record.get('counterX');
            const counterY = record.get('counterY');
            const tables = record.get('tables');

            // Convert the flatMaps back to a 2D array
            const maps = [];
            for (let i = 0; i < mapX; i++) {
                maps.push(flatMaps.slice(i * mapY, (i + 1) * mapY));
            }

            // Set the data
            data.maps = maps;
            data.location.counter = [counterX, counterY];
            data.location.kitchen = [kitchenX, kitchenY];

            // Set the table data
            for (const table of tables) {
                const tableNumber = table.tableNumber;
                data.location.table[tableNumber] = [table.x, table.y];
            }
        }
        // console.log(data)
        return data;
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        session.close();
    }
}
// 反函式of processData
function convertDataToInputArray(data) {
    const inputArray = [];
    for (let i = 0; i < data.maps.length; i++) {
        const row = data.maps[i];
        const newRow = [];

        for (let j = 0; j < row.length; j++) {
            const value = row[j];

            if (value === 1) {
                const kitchenPos = data.location.kitchen;
                const counterPos = data.location.counter;
                let tablePos = null;

                // Check if the position is for a table
                for (const tableNumber in data.location.table) {
                    const tablePosArr = data.location.table[tableNumber];
                    if (tablePosArr[0] === i && tablePosArr[1] === j) {
                        tablePos = tableNumber;
                        break;
                    }
                }

                if (kitchenPos[0] === i && kitchenPos[1] === j) {
                    newRow.push(-3); // Convert back to -3 for kitchen
                } else if (counterPos[0] === i && counterPos[1] === j) {
                    newRow.push(-2); // Convert back to -2 for counter
                } else if (tablePos !== null) {
                    newRow.push(parseInt(tablePos)); // Convert back to table number
                } else {
                    newRow.push(-1); // Convert back to -1 for a value of 1
                }
            } else {
                newRow.push(value);
            }
        }
        inputArray.push(newRow);
    }
    return inputArray;
}


module.exports = {
    getMenu,
    getDataFromNeo4j,
    convertDataToInputArray
};