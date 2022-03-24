const https = require('https');
const fs = require('fs');
const letSigned = require('../security/signMain.js');


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
            time =  time.substr(1, time.length);
            time =  time.substr(0, time.length-1);
       
          

            let chal = JSON.stringify(d.challenge);
            chal =  chal.substr(1, chal.length);
            chal =  chal.substr(0, chal.length-1);
            console.log(chal)

            let doc = '<?xml version="1.0" encoding="UTF-8"?>\n<ns3:InitSessionSignedRequest\nxmlns="http://ksef.mf.gov.pl/schema/gtw/svc/online/types/2021/10/01/0001"\nxmlns:ns2="http://ksef.mf.gov.pl/schema/gtw/svc/types/2021/10/01/0001"\nxmlns:ns3="http://ksef.mf.gov.pl/schema/gtw/svc/online/auth/request/2021/10/01/0001">\n<ns3:Context>\n<Challenge>${chal}</Challenge>\n<Identifier xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns2:SubjectIdentifierByCompanyType">\n<ns2:Identifier>1111111111</ns2:Identifier>\n</Identifier>\n<DocumentType>\n<ns2:Service>KSeF</ns2:Service>\n<ns2:FormCode>\n<ns2:SystemCode>FA (1)</ns2:SystemCode>\n<ns2:SchemaVersion>1-0E</ns2:SchemaVersion>\n<ns2:TargetNamespace>http://crd.gov.pl/wzor/2021/11/29/11089/</ns2:TargetNamespace>\n<ns2:Value>FA</ns2:Value>\n</ns2:FormCode>\n</DocumentType>\n<Encryption>\n<ns2:EncryptionKey>\n<ns2:Encoding>Base64</ns2:Encoding>\n<ns2:Algorithm>AES</ns2:Algorithm>\n<ns2:Size>256</ns2:Size>\n<ns2:Value>H2+YWam2q/6GJafnC+qbkWDeNvZb8brpUkXw5cstNP5GnK+DGyIIwgCS7kXJXa2X8BOh9OWJXry5l7wZMq+WCXCif1+pQ+5+FbJlm16A3PB5BNy2S6cBubS2Q+kdk5FJs7pFMt6U+6jEPKMrmxi0D3nFyYK6cKmVZFQHa/4faj7qa70KEpyL49WJxdHGbQfAoe05z5OKyiZZftz+oGJVystA+fCLufVhiZ7gIuZLov8aamO1ghum1vYsG7nqJ1OrmUVrpgqv5jCqdMo+4FqG9XMKntgGsmydskjPiSxj1mF4+qNAP6neINrDrG+M1lCg/VBhrdnTAGnyfsODfohbiw==</ns2:Value>\n</ns2:EncryptionKey>\n<ns2:EncryptionInitializationVector>\n<ns2:Encoding>Base64</ns2:Encoding>\n<ns2:Bytes>16</ns2:Bytes>\n<ns2:Value>5+DjwCfRIQPaX1Rj3jMAWw==</ns2:Value>\n</ns2:EncryptionInitializationVector>\n<ns2:EncryptionAlgorithmKey>\n<ns2:Algorithm>RSA</ns2:Algorithm>\n<ns2:Mode>ECB</ns2:Mode>\n<ns2:Padding>PKCS#1</ns2:Padding>\n</ns2:EncryptionAlgorithmKey>\n<ns2:EncryptionAlgorithmData>\n<ns2:Algorithm>AES</ns2:Algorithm>\n<ns2:Mode>CBC</ns2:Mode>\n<ns2:Padding>PKCS#7</ns2:Padding>\n</ns2:EncryptionAlgorithmData>\n</Encryption>\n<Type>SerialNumber</Type>\n</ns3:Context>\n </ns3:InitSessionSignedRequest>\n'          ;
            fs.writeFileSync('./doc/initSessionSign.xml', doc, function(err){
                if (err) 
                return console.log(err);
                console.log('Stworzono dokument');      
            });
            let signature = letSigned(doc);

            let signedDoc = `<?xml version="1.0" encoding="UTF-8"?>
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
                    <Encryption>
                        <ns2:EncryptionKey>
                            <ns2:Encoding>Base64</ns2:Encoding>
                            <ns2:Algorithm>AES</ns2:Algorithm>
                            <ns2:Size>256</ns2:Size>
                            <ns2:Value>H2+YWam2q/6GJafnC+qbkWDeNvZb8brpUkXw5cstNP5GnK+DGyIIwgCS7kXJXa2X8BOh9OWJXry5l7wZMq+WCXCif1+pQ+5+FbJlm16A3PB5BNy2S6cBubS2Q+kdk5FJs7pFMt6U+6jEPKMrmxi0D3nFyYK6cKmVZFQHa/4faj7qa70KEpyL49WJxdHGbQfAoe05z5OKyiZZftz+oGJVystA+fCLufVhiZ7gIuZLov8aamO1ghum1vYsG7nqJ1OrmUVrpgqv5jCqdMo+4FqG9XMKntgGsmydskjPiSxj1mF4+qNAP6neINrDrG+M1lCg/VBhrdnTAGnyfsODfohbiw==</ns2:Value>
                        </ns2:EncryptionKey>
                        <ns2:EncryptionInitializationVector>
                            <ns2:Encoding>Base64</ns2:Encoding>
                            <ns2:Bytes>16</ns2:Bytes>
                            <ns2:Value>5+DjwCfRIQPaX1Rj3jMAWw==</ns2:Value>
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
                    <Type>SerialNumber</Type>
                </ns3:Context> 
                ${signature}
            </ns3:InitSessionSignedRequest>           
             `
            fs.writeFileSync('./doc/initSessionSigned.xml', signedDoc, function(err){
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
    return "/authChallange2 done";

}
