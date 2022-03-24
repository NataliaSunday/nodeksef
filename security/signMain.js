const fs = require("fs");
var { Crypto } = require("@peculiar/webcrypto");
const xadesjs = require("xadesjs");
const { XMLSerializer } = require("xmldom");

const crypto = new Crypto();

xadesjs.Application.setEngine("NodeJS", new Crypto());

function preparePem(pem) {
    return pem
        // remove BEGIN/END
        .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, "")
        // remove \r, \n
        .replace(/[\r\n]/g, "");
}

function pem2der(pem) {
    pem = preparePem(pem);
    // convert base64 to ArrayBuffer
    return new Uint8Array(Buffer.from(pem, "base64")).buffer;
}


   
async function main() {
        const hash = "SHA-256"
        const alg = {
            name: "RSASSA-PKCS1-v1_5",
            hash,
        }
    
    const certPem = fs.readFileSync("../keys/myCert.crt", { encoding: "utf8" });
    const certDer = pem2der(certPem);
    
    const keyPem = fs.readFileSync("../keys/myPrivateKey.pem", { encoding: "utf8" });
    const keyDer = pem2der(keyPem);
    const key = await crypto.subtle.importKey("pkcs8", keyDer, alg, false, ["sign"]);
    
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<ns3:InitSessionSignedRequest\nxmlns="http://ksef.mf.gov.pl/schema/gtw/svc/online/types/2021/10/01/0001"\nxmlns:ns2="http://ksef.mf.gov.pl/schema/gtw/svc/types/2021/10/01/0001"\nxmlns:ns3="http://ksef.mf.gov.pl/schema/gtw/svc/online/auth/request/2021/10/01/0001">\n<ns3:Context>\n<Challenge></Challenge>\n<Identifier xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns2:SubjectIdentifierByCompanyType">\n<ns2:Identifier>1111111111</ns2:Identifier>\n</Identifier>\n<DocumentType>\n<ns2:Service>KSeF</ns2:Service>\n<ns2:FormCode>\n<ns2:SystemCode>FA (1)</ns2:SystemCode>\n<ns2:SchemaVersion>1-0E</ns2:SchemaVersion>\n<ns2:TargetNamespace>http://crd.gov.pl/wzor/2021/11/29/11089/</ns2:TargetNamespace>\n<ns2:Value>FA</ns2:Value>\n</ns2:FormCode>\n</DocumentType>\n<Encryption>\n<ns2:EncryptionKey>\n<ns2:Encoding>Base64</ns2:Encoding>\n<ns2:Algorithm>AES</ns2:Algorithm>\n<ns2:Size>256</ns2:Size>\n<ns2:Value>H2+YWam2q/6GJafnC+qbkWDeNvZb8brpUkXw5cstNP5GnK+DGyIIwgCS7kXJXa2X8BOh9OWJXry5l7wZMq+WCXCif1+pQ+5+FbJlm16A3PB5BNy2S6cBubS2Q+kdk5FJs7pFMt6U+6jEPKMrmxi0D3nFyYK6cKmVZFQHa/4faj7qa70KEpyL49WJxdHGbQfAoe05z5OKyiZZftz+oGJVystA+fCLufVhiZ7gIuZLov8aamO1ghum1vYsG7nqJ1OrmUVrpgqv5jCqdMo+4FqG9XMKntgGsmydskjPiSxj1mF4+qNAP6neINrDrG+M1lCg/VBhrdnTAGnyfsODfohbiw==</ns2:Value>\n</ns2:EncryptionKey>\n<ns2:EncryptionInitializationVector>\n<ns2:Encoding>Base64</ns2:Encoding>\n<ns2:Bytes>16</ns2:Bytes>\n<ns2:Value>5+DjwCfRIQPaX1Rj3jMAWw==</ns2:Value>\n</ns2:EncryptionInitializationVector>\n<ns2:EncryptionAlgorithmKey>\n<ns2:Algorithm>RSA</ns2:Algorithm>\n<ns2:Mode>ECB</ns2:Mode>\n<ns2:Padding>PKCS#1</ns2:Padding>\n</ns2:EncryptionAlgorithmKey>\n<ns2:EncryptionAlgorithmData>\n<ns2:Algorithm>AES</ns2:Algorithm>\n<ns2:Mode>CBC</ns2:Mode>\n<ns2:Padding>PKCS#7</ns2:Padding>\n</ns2:EncryptionAlgorithmData>\n</Encryption>\n<Type>SerialNumber</Type>\n</ns3:Context>\n </ns3:InitSessionSignedRequest>\n`;

    var xml = xadesjs.Parse(xmlString);

    let xadesXml = new xadesjs.SignedXml();
    const x509 = preparePem(certPem);
    const signature = await xadesXml.Sign(
        alg,                                    // algorithm
        key,                                    // key
        xml ,                                    // document
        {    
            references: [
                { hash, transforms: ["c14n", "enveloped"] }
            ],
            signingCertificate: x509
        })
          


            xml.documentElement.appendChild(signature.GetXml());

            // serialize XML
            const oSerializer = new XMLSerializer();
            const sXML = oSerializer.serializeToString(xml);
            console.log(sXML.toString());
            fs.writeFileSync('../doc/initSessionSigned.xml', sXML, function(err){
                if (err) 
                return console.log(err);
                console.log('Stworzono dokument podpisany');      
            });
}
        
main()
    .catch((err) => {
        console.error(err);
});