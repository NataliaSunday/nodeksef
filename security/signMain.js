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

module.exports =   
async function main(doc) {
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
    
    let xmlString = doc;
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
            fs.writeFileSync('./doc/initSigned.xml', sXML, (err) => {
                console.log(err);
            });
          
}
        
 
