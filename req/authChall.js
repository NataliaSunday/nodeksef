const https = require('https');
const fs = require('fs');
const encrypt = require('../security/crypto');

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
      
module.exports = function authChal(){
        
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            
            console.log(d);
            process.stdout.write(d)
            d = JSON.parse(d);
            console.log(d.timestamp);

            let time = JSON.stringify(d.timestamp);
            time = time.substr(1, time.length);
            time = time.substr(0, time.length-1);

            let encryptedTime = encrypt(time);
            console.log(encryptedTime);

            let chal = JSON.stringify(d.challenge);
            chal = chal.substr(1, chal.length);
            chal = chal.substr(0, chal.length-1);
            console.log(chal)

            let doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
           <ns3:InitSessionTokenRequest
               xmlns="http://ksef.mf.gov.pl/schema/gtw/svc/online/types/2021/10/01/0001"
               xmlns:ns2="http://ksef.mf.gov.pl/schema/gtw/svc/types/2021/10/01/0001"
               xmlns:ns3="http://ksef.mf.gov.pl/schema/gtw/svc/online/auth/request/2021/10/01/0001">
               <ns3:Context>
                   <Timestamp>${time}</Timestamp>
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
                   <Encryption>
                <ns2:EncryptionKey>
                    <ns2:Encoding>Base64</ns2:Encoding>
                    <ns2:Algorithm>AES</ns2:Algorithm>
                    <ns2:Size>256</ns2:Size>
                    <ns2:Value>Kmrs/g9ZjI5lKDoMukGDMDULgvx0BkZ6qHEazLLo+LmzK4FNhNp4owcPioydkuiJE02norz5P5hjFO+SMO9kgtPji0Qjx57B+o6tKMUlL6EA3nn40+JNkZuvW+hUnEt7/kxZCcjxEXTuLpQuANwovUxdej041nKRY+sthBEDb3gN4pzJ+HfACysB8H5dpvZj1MkBe7hydLCJlNkEYHYA5dO/3FnW/5fh12Be3ij7Z410+3XZT5AiteEwGCJCPdC0epM3yJgi8uZt2vqn83fgYqSqmMtXLk0ZVjTT4Z1wd2cZ3DF7tlIfoYeB2DKQiwbXAZr/W3jVzYliXBykZLC/Sg==</ns2:Value>
                </ns2:EncryptionKey>
                <ns2:EncryptionInitializationVector>
                    <ns2:Encoding>Base64</ns2:Encoding>
                    <ns2:Bytes>16</ns2:Bytes>
                    <ns2:Value>H9KQyy/SHurlswE4pxSIsg==</ns2:Value>
                </ns2:EncryptionInitializationVector>
                <ns2:EncryptionAlgorithmKey>
                    <ns2:Algorithm>RSA</ns2:Algorithm>
                    <ns2:Mode>ECB</ns2:Mode>
                    <ns2:Padding>PKCS#1</ns2:Padding>
                </ns2:EncryptionAlgorithmKey>
                <ns2:EncryptionAlgorithmData>
                    <ns2:Algorithm>AES</ns2:Algorithm>
                    <ns2:Mode>CBC</ns2:Mode>
                    <ns2:Padding>PKCS#7</ns2:Padding>
                </ns2:EncryptionAlgorithmData>
                </Encryption>
                   <Token>${encryptedTime}</Token>
               </ns3:Context>
           </ns3:InitSessionTokenRequest>
            `;
            
            fs.writeFile('./Doc/initSessionToken.xml', doc, function(err){
                if (err) 
                return console.log(err);
                console.log('Stworzono dokument');

            });
        })
    })
    req.on('error', error => {
        console.error(error);
      });
    req.write(data);
    req.end();

    return "/authChallange done";
}
