const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 8000;

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
       process.stdout.write(d)
	  d = JSON.parse(d);
	  console.log(d.timestamp);
	  let chal = JSON.stringify(d.challenge);
	  chal =  chal.substr(1, chal.length);
	  chal =  chal.substr(0, chal.length-1);
	  console.log(chal)
	   let doc = `<?xml version="1.0" encoding="UTF-8"?>
		<ns3:InitSessionSignedRequest
			xmlns="http://ksef.mf.gov.pl/schema/gtw/svc/online/types/2021/10/01/0001"
			xmlns:ns2="http://ksef.mf.gov.pl/schema/gtw/svc/types/2021/10/01/0001"
			xmlns:ns3="http://ksef.mf.gov.pl/schema/gtw/svc/online/auth/request/2021/10/01/0001">
			<ns3:Context>
				<Challenge>${chal}</Challenge>
				<Identifier xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns2:SubjectIdentifierByCompanyType">
					<ns2:Identifier>1111111111</ns2:Identifier>
				</Identifier>
				<DocumentType>
					<ns2:Service>KSeF</ns2:Service>
					<ns2:FormCode>
						<ns2:SystemCode>FA (1)</ns2:SystemCode>
						<ns2:SchemaVersion>1-0E</ns2:SchemaVersion>
						<ns2:TargetNamespace>http://crd.gov.pl/wzor/2021/11/29/11089/</ns2:TargetNamespace>
						<ns2:Value>FA</ns2:Value>
					</ns2:FormCode>
				</DocumentType>			
			</ns3:Context>
		</ns3:InitSessionSignedRequest>
		`;
      fs.writeFile('initSessionToken.xml', doc, function(err){
		if (err) 
        return console.log(err);
    	console.log('Stworzono dokument');
	  });
})
})
req.on('error', error => {
    console.error(error);
  });

req.write(data)
req.end()

  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });

 