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

    getSigned(doc)
    .then((res) => {
        fs.promises.access('./doc/initSigned.xml', fs.constants.F_OK)
        console.log('promiss 1')
        .then((res) =>{
            let data = fs.readFile('./doc/initSigned.xml')
            console.log('promiss 2')
            .then((res) =>{
                console.log('promiss 3')
                const req = https.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`)
                
                    res.on('data', d => {
                        
                       
                        process.stdout.write(d)
                        });
                    })
                req.on('error', error => {
                    console.error(error);
                });    
                console.log('promiss 3.2')
                req.write(data);
                req.end();
                return "/authChallange2 done";
            })
            .catch((rej)=>{
                console.log('no req');
                console.log('catch 3')
            });
           
        }).catch((rej) => {
            console.log('nei ma pliku')
            console.log('catch 2')
        })
    })
}


 
    
