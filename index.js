const express = require('express');
const https = require('https');
const app = express();


const port = 8000;
let challengeAuth;
const data = JSON.stringify({
  "contextIdentifier": {
    "type": "onip",
    "identifier": "1111111111"
  }
})
const options = {
    hostname: 'ksef-test.mf.gov.pl',
    path: '/api/online/Session/AuthorisationChallenge',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
}

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
       console.log(d);
       challengeAuth = d;
    })
})

req.on('error', error => {
    console.error(error)
  })

req.write(data)
req.end()

app.get('/', (req, res) => {
  res.send(challengeAuth)

});

  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 



/*app.get(':enpoint([\\/\\w\\.-]*)', function(req, res){
    let endpoint = 'https://ksef-test.mf.gov.pl/api' + req.params.endpoint

    axios.get(endpoint)
    .then( response => {
        res.json(response)
    }).catch(err => {
        res.json(err)
    })

})
/*/