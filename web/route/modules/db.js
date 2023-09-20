const neo4j = require('neo4j-driver')
const fs = require('fs');

const dbfile = JSON.parse(fs.readFileSync('config.json', 'utf8')).dbFile;
const dbpwd  = JSON.parse(fs.readFileSync(dbfile, 'utf8')).dbpwd;

const uri = 'bolt://125.229.139.63:7687';
const user = 'neo4j';
const password = dbpwd;


const db = neo4j.driver(uri, neo4j.auth.basic(user, password))

module.exports = db;