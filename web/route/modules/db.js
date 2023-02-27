const neo4j = require('neo4j-driver')

const db = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'neo4j'))


module.exports = db;