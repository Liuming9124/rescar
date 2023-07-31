const db = require("../route/modules/db");
const http = require('http');
const fs = require('fs');
// var session = db.session()
function processData(inputArray) {
    const data = {
        maps: [],
        location: {
            counter: [],
            kitchen: [],
            table: {}
        }
    };

    for (let i = 0; i < inputArray.length; i++) {
        const row = inputArray[i];
        const newRow = [];

        for (let j = 0; j < row.length; j++) {
            const value = row[j];

            if (value === -1) {
                newRow.push(1);
            } else if (value === -2) {
                newRow.push(1);
                data.location.counter = [i, j];
            } else if (value === -3) {
                newRow.push(1);
                data.location.kitchen = [i, j];
            } else if (value >= 1) {
                newRow.push(1);
                data.location.table[value.toString()] = [i, j];
            } else {
                newRow.push(value);
            }
        }
        data.maps.push(newRow);
    }
    return data;
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

// 建立一個函式來執行寫入操作   
async function writeDataToNeo4j(data) {
    // Convert the maps 2D array into a 1D array
    const flatMaps = data.maps.flat();
    var session = db.session()
    try {
        // Delete old existing nodes and relationships
        await session.run('MATCH (n:Kitchen), (b:Counter), (x:Map), (y:Table), (r:Robot) DETACH DELETE n, b, x, y, r');
        // Create the Map node and set the flatMaps property
        const mapResult = await session.run(
            'CREATE (m:Map {x: $x, y: $y, flatMaps: $flatMaps}) RETURN m',
            { x: data.maps.length, y: data.maps[0].length, flatMaps: flatMaps }
        );

        const mapNode = mapResult.records[0].get('m');

        // Create Counter node
        const counterCoordinate = data.location.counter;
        const counterResult = await session.run(
            'CREATE (c:Counter {x: $x, y: $y}) RETURN c',
            { x: counterCoordinate[0], y: counterCoordinate[1] }
        );
        const counterNode = counterResult.records[0].get('c');

        // Create Kitchen node
        const kitchenCoordinate = data.location.kitchen;
        const kitchenResult = await session.run(
            'CREATE (k:Kitchen {x: $x, y: $y}) RETURN k',
            { x: kitchenCoordinate[0], y: kitchenCoordinate[1] }
        );
        const kitchenNode = kitchenResult.records[0].get('k');

        // Create Table nodes and relationships with Map node
        const tableKeys = Object.keys(data.location.table);
        for (const tableKey of tableKeys) {
            const tableCoordinate = data.location.table[tableKey];
            const tableResult = await session.run(
                'CREATE (t:Table {x: $x, y: $y, tableNumber: $tableNumber}) RETURN t',
                { x: tableCoordinate[0], y: tableCoordinate[1], tableNumber: tableKey }
            );
            const tableNode = tableResult.records[0].get('t');
        }
        // Create Robot node and Relationship
        await session.run(`
            MATCH (n:Kitchen), (b:Counter), (x:Map), (y:Table) 
            MERGE (r:Robot)
            CREATE (r)-[:has]->(n), (r)-[:has]->(b), (r)-[:has]->(x), (r)-[:has]->(y)
            RETURN n, b, x, y, r    
        `)

        console.log('Data has been written to Neo4j successfully.');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        session.close();
    }
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


const mapController = {

    mapPage: async (req, res) => {
        // Download Maps from Neo4j
        var maps = await getDataFromNeo4j()
        // console.log('afterData:', maps)
        var showMaps = await convertDataToInputArray(maps)
        // console.log('convertData:', showMaps)   
        res.render('map', {
            "maps":showMaps 
        })
    },
    mapUpload: async (req, res) => {
        try {
            var map = req.body
            // console.log('receive new maps:', map)
            var data = await processData(map);
            console.log('initData:', data)
            // console.log('data:', JSON.stringify(data))
            
            // Send Maps to Robot
            const jsonData = JSON.stringify(data);
            // read config.json
            const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            console.log(config.robotport, config.robotip)
            const options = {
                hostname: config.robotip,
                port: config.robotport,
                path: '/mapSet',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type header for JSON data
                    'Content-Length': jsonData.length // Set the content length header
                }
            };
            const promise = new Promise((resolve, reject) => {
                const request = http.request(options, response => {
                    // console.log(`statusCode: ${response.statusCode}`);
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve(data);
                    });
                });
                request.on('error', error => {
                    reject(error);
                });
                request.write(jsonData);
                request.end();
            });

            promise.then(data => {
                const word = JSON.parse(data); // extract the word from the response body
                console.log(word);
                // Upload Maps to Neo4j
                writeDataToNeo4j(data);
                res.send('{"status": "error"}');
            }).catch(error => {
                console.error(error);
                res.send('{"status": "robot connect error: maps upload"}');
            });
        }catch(error){
            console.error('mapupload error:', error);
            res.send('{"status": "robot not connected"}');
        }
    }
}

module.exports = mapController