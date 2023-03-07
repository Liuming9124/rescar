const neo4j = require('neo4j-driver')


const uri = 'bolt://125.229.139.63:7687';
const user = 'neo4j';
const password = 'O2dDsdj9AJIiKFq9rKsHd8iZAxtdo0Am7UpmMqhMhcU';


const db = neo4j.driver(uri, neo4j.auth.basic(user, password))

module.exports = db;