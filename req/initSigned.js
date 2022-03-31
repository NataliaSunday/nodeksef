const https = require('https');
const fs = require('fs');
const getSigned = require('../security/sign.js')


const options = {
    hostname: 'ksef-test.mf.gov.pl',
    path: '/api/online/Session/InitSigned',
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        'accept': 'application/json'
    }
}
      

module.exports = function initSigned (doc)  {

    getSigned(doc);
    let data =fs.readFileSync('./doc/initSigned.xml');
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            
           
            process.stdout.write(d)
            });
        })
    req.on('error', error => {
        console.error(error);
    });    
    req.write(data);
    req.end();
    return "/authChallange2 done";
}