const neo4j = require('neo4j-driver')

const db = neo4j.driver('neo4j+s://4c593094.databases.neo4j.io', neo4j.auth.basic('neo4j', 'O2dDsdj9AJIiKFq9rKsHd8iZAxtdo0Am7UpmMqhMhcU'))

module.exports = db;