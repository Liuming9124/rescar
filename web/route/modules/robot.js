const express = require('express')
const router = express.Router()

const robotCtl = require('../../controllers/robotctl')
const fs = require('fs');
// read config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const http = require('http');


router.get('/', robotCtl.robotPage)
router.post('/place', robotCtl.robotPlace)
router.get('/orderget', robotCtl.orderGet)
router.get('/robotip', (req, res) => {
    res.send({ robotip: config.robotip });
});
router.post('/robotRun', (req, res) => {
    const options = {
        hostname: '192.168.4.3',
        port: 8000,
        path: '/',
        method: 'GET'
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
        request.end();
    });

    promise.then(data => {
        const word = JSON.parse(data); // extract the word from the response body
        console.log(word);
        res.send(word);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });

});


module.exports = router