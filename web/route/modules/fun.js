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

    console.log('menu:', JSON.stringify(menu));

    return Promise.resolve(JSON.stringify(menu));
}

module.exports = {
    getMenu
};