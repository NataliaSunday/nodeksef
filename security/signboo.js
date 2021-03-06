/*const xadesjs = require('xadesjs');
const { Crypto } = require('@peculiar/webcrypto');

const fs = require('fs');
const { Certificate } = require('crypto');

xadesjs.Application.setEngine("NodeJS", new Crypto());
console.log('lol');


module.exports = function letSigned(doc){
        
    let myPrivateKey, myPublicKey;
    xadesjs.Application.crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 1024,
        publicExponent: new Uint8Array([ 1, 0 , 1]),
        hash: { name: 'SHA-256'}
    },false,
    ['sign' , 'verify']
    ).then(function (keyPair) {
        myPrivateKey = keyPair.privateKey;
        myPublicKey = keyPair.publicKey;
        console.log("Stworzono klucz");   
        let xmlString = doc;
    return SignXml(xmlString, keyPair, {name: 'RSASSA-PKCS1-v1_5', hash: { name: "SHA-256" } })})
        .then(function (signedDocument) {
            console.log("Signed document:\n\n", signedDocument);
           

        })
        .catch(function (e) {
            console.error(e);
        });
    }

    function SignXml(xmlFileContent, keys, algorithm) {
     return Promise.resolve()
        .then( () => {
            var xmlDoc = xadesjs.Parse(xmlFileContent);
            let signedXml = new xadesjs.SignedXml();

            return signedXml.Sign(
                algorithm,
                keys.privateKey,
                xmlDoc,{
                    keyValue: keys.publicKey,
                    references: [
                        { hash: "SHA-256", transforms: ["enveloped"] }
                    ],
                
               })
    })
            .then(signature => signature.toString());
    }

    const crypto = require('crypto');
    const fs = require('fs');
    const xadesjs = require('xadesjs');
    const { Crypto } = require('@peculiar/webcrypto');
    
    
    xadesjs.Application.setEngine("NodeJS", new Crypto());
    
     //---sprawdzanie klucy 
    if((fs.existsSync('./keys/myPublicKey.pem'))&&((fs.existsSync('./keys/myPrivateKey.pem')))){
    console.log('myPublicublicKey i myPrivateKey istnieje');
    
    }else{
       
        generateKeyFiles();
        console.log(generateKeyFiles())
        console.log('ju?? istnieje');
    }
    
    module.exports = function letSigned(doc){
        let priv = fs.readFileSync('./keys/myPrivateKey.pem');
        let privHash = crypto.createHmac('sha256', priv); //hashowanie
       
        let pub = fs.readFileSync('./keys/myPublicKey.pem');
        let pubHash = crypto.createHmac('sha256', pub)
        let keyPair = {
            privateKey: privHash,
            publicKey: pubHash
        }
        return SignXml(doc, keyPair, {name: 'RSASSA-PKCS1-v1_5', hash: { name: "SHA-256" } });
    }
        
    
       //---generowanie kluczy
    function generateKeyFiles() {
        const keyPair = crypto.generateKeyPair('rsa', {
            modulusLength: 1024,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: ''
            }
        });
        fs.writeFileSync('../keys/myPublicKey.pem', keyPair.publicKey);  
        fs.writeFileSync('../keys/myPrivateKey.pem', keyPair.privateKey);
    
        return keyPair; 
    }
    
    //--podpisywanie xmla
    function SignXml(xmlFileContent, keys, algorithm) {
        return Promise.resolve()
           .then( () => {
               var xmlDoc = xadesjs.Parse(xmlFileContent);
               let signedXml = new xadesjs.SignedXml();
               return signedXml.Sign(
                    algorithm,
                    keys.privateKey,
                    xmlDoc,{
                       keyValue: keys.publicKey,
                       references: [
                        { hash: "SHA-256", transforms: ["enveloped"] }
                       ],
                   
                   signingCertificate: 'MIIC5jCCAc4CAQAwgaAxCzAJBgNVBAYTAlBMMRIwEAYDVQQIDAlMdWJlbHNraWUxDzANBgNVBAcMBkx1YmxpbjEOMAwGA1UECgwFc2tpY2gxDDAKBgNVBAsMA0VDTTEUMBIGA1UEAwwLdGVzdCBrbGllbnQxHTAbBgkqhkiG9w0BCQEWDm5hdGFsaWFAeHh4LnBsMRkwFwYDVQRhDBBWQVRQTC00MjU3MDA3NjkwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzXKm6KX87PRwZ1WVzeAbRW9Yj5CswGQnYotjYefwv9O+5cYcP9zf4owJ2Jnht8VTQbJjvqM5ajRa02cKRtkfa/WqwZteD6KTsCfjc4OUtqWGjItvGtBvRqfjx+Dz5Bu5VKowYBa8mjKL5NK5V8/jt0hcXavu2PVpiW4XzYI3PG3GkqxQINHlFQjYgMEJropXJgL0p1I+sNXXuBhbuWJpa9K/312Dh9j4JdfjKxsOul0OQGFsuIoYVl7aYN6ktMkGvX9ZwdNsBvBLe6CPu2jKEanx06rs7c3ouAxpBwYRCf2PX1IsZhFjGvi0jZo7WF0II5WD3dGm3kcDEWSteWUeQQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAJlHoAMLyV4Mp/rsKBHg2MSDSZBt0jFmGkdRO466I5pOE3ZXVyHwRTTM+zTeaQMGZIDXVnyn3IyQRoagoi5FfsGk6RTweW/um4sv6SwXIYJpzHTfJlT8Zn7sU1WEj1Vz21wwNiNM6hqqXjSN4WlbKcCDajKWk33qfWPd6p2N4Jmp+76gNpNkcDhOXK0VC2wtmAEUEhoDc/sPC3w9Mi816Hy1jur3yesXxXgcJ9AIewPjTCxZyNLKPXMiM3rL3OsUmWIGwzlSxTvHkDBmrmCZbPxC3BRnvTMnTajt0v61ImN+jWRzHGfy6Ub/mhvyyuTkf6xU/y9CiByCvJlGlTeFIhs=',
                   })
       })
               .then(signature => signature.toString()).catch(err => console.log(err));
               
       }
    
    
    
    /*
    
    function generateKeyFiles() {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 520,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: ''
            }
        });
        fs.writeFileSync('../keys/myPublicKey.pem', keyPair.publicKey);  
        fs.writeFileSync('../keys/myPrivateKey.pem', keyPair.privateKey);
    
        return keyPair; 
    }
    function generateKeyFiles(){
        let myPrivateKey, myPublicKey;
        xadesjs.Application.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([ 1, 0 , 1]),
            hash: { name: 'SHA-256'}
        },false,
        ['sign' , 'verify']
        ).then(function (keyPair) {
            myPrivateKey = keyPair.privateKey;
            myPublicKey = keyPair.publicKey;
            console.log("Stworzono klucz");
            fs.writeFileSync('../keys/myPublicKey.pem', keyPair.publicKey);  
            fs.writeFileSync('../keys/myPrivateKey.pem', keyPair.privateKey);
        }).catch(err => {
            console.log(err)
        })   
    }
    
    ------------const xadesjs = require('xadesjs');
    const fs = require('fs');
    
    xadesjs.Application.setEngine("NodeJS", new Crypto());
    
    module.exports = function letSigned(doc){
    
        let myPrivateKey = fs.readFileSync('../keys/myPrivateKey.pem');
        let myPublicKey = fs.readFileSync('../keys/myPublicKey.pem');
    
        let xmlString = doc;
        let signedXml = new xadesjs.SignedXml();
    
        return SignXml(xmlString, {myPrivateKey, myPublicKey, {name: 'RSASSA-PKCS1-v1_5', hash: { name: "SHA-256" } })})
        .then(function (signedDocument) {
            console.log("Signed document:\n\n", signedDocument);
           
    
        })
        .catch(function (e) {
            console.error(e);
        });
    
    }
    
    
    function SignXml(xmlFileContent, keys, algorithm) {
        return Promise.resolve()
           .then( () => {
               var xmlDoc = xadesjs.Parse(xmlFileContent);
               let signedXml = new xadesjs.SignedXml();
    
               return signedXml.Sign(
                   algorithm,
                   keys.privateKey,
                   xmlDoc,{
                       keyValue: keys.publicKey,
                       references: [
                           { hash: "SHA-256", transforms: ["enveloped"] }
                       ],
                   
                   signingCertificate: 'MIIC5jCCAc4CAQAwgaAxCzAJBgNVBAYTAlBMMRIwEAYDVQQIDAlMdWJlbHNraWUxDzANBgNVBAcMBkx1YmxpbjEOMAwGA1UECgwFc2tpY2gxDDAKBgNVBAsMA0VDTTEUMBIGA1UEAwwLdGVzdCBrbGllbnQxHTAbBgkqhkiG9w0BCQEWDm5hdGFsaWFAeHh4LnBsMRkwFwYDVQRhDBBWQVRQTC00MjU3MDA3NjkwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzXKm6KX87PRwZ1WVzeAbRW9Yj5CswGQnYotjYefwv9O+5cYcP9zf4owJ2Jnht8VTQbJjvqM5ajRa02cKRtkfa/WqwZteD6KTsCfjc4OUtqWGjItvGtBvRqfjx+Dz5Bu5VKowYBa8mjKL5NK5V8/jt0hcXavu2PVpiW4XzYI3PG3GkqxQINHlFQjYgMEJropXJgL0p1I+sNXXuBhbuWJpa9K/312Dh9j4JdfjKxsOul0OQGFsuIoYVl7aYN6ktMkGvX9ZwdNsBvBLe6CPu2jKEanx06rs7c3ouAxpBwYRCf2PX1IsZhFjGvi0jZo7WF0II5WD3dGm3kcDEWSteWUeQQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAJlHoAMLyV4Mp/rsKBHg2MSDSZBt0jFmGkdRO466I5pOE3ZXVyHwRTTM+zTeaQMGZIDXVnyn3IyQRoagoi5FfsGk6RTweW/um4sv6SwXIYJpzHTfJlT8Zn7sU1WEj1Vz21wwNiNM6hqqXjSN4WlbKcCDajKWk33qfWPd6p2N4Jmp+76gNpNkcDhOXK0VC2wtmAEUEhoDc/sPC3w9Mi816Hy1jur3yesXxXgcJ9AIewPjTCxZyNLKPXMiM3rL3OsUmWIGwzlSxTvHkDBmrmCZbPxC3BRnvTMnTajt0v61ImN+jWRzHGfy6Ub/mhvyyuTkf6xU/y9CiByCvJlGlTeFIhs=',
                   })
       })
               .then(signature => signature.toString());
       }
    /*
    
    SignedXml.Sign(algorithm: Algorithm, key: CryptoKey, data: Document, options?: OptionsXAdES): PromiseLike<Signature>;
    
    
    var xadesjs = require("xadesjs");
    var { Crypto } = require("@peculiar/webcrypto");
    const fs = require('fs');
    
    xadesjs.Application.setEngine("NodeJS", new Crypto());
    
    // Generate RSA key pair
    module.exports = function sign(){
        var privateKey, publicKey;
        xadesjs.Application.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024, //can be 1024, 2048, or 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-1" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign", "verify"] //can be any combination of "sign" and "verify"
    )
        .then(function (keyPair) {
            // Push ganerated keys to global variable
            privateKey = keyPair.privateKey;
            publicKey = keyPair.publicKey;
    
            // Call sign function
            var xmlString = toString(fs.readFileSync("./doc/initSessionSign.xml"));
            console.log(xmlString)
            return SignXml(xmlString, keyPair, { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } });
        })
        .then(function (signedDocument) {
            console.log("Signed document:\n\n", signedDocument);
        })
        .catch(function (e) {
            console.error(e);
        });
    
    }
    
        
    function SignXml(xmlString, keys, algorithm) {
        return Promise.resolve()
            .then(() => {
                var xmlDoc = xadesjs.Parse(xmlString);
                var signedXml = new xadesjs.SignedXml();
    
                return signedXml.Sign(               // Signing document
                    algorithm,                              // algorithm https://4programmers.net/Forum/Nietuzinkowe_tematy/355933-ksef_krajowy_system_e_faktur?page=12
                    keys.privateKey,                        // key
                    xmlDoc,                                 // document
                    {                                       // options
                        keyValue: keys.publicKey,
                        references: [
                            { hash: "SHA-256", transforms: ["enveloped"] }
                        ],
                        productionPlace: {
                            country: "Country",
                            state: "State",
                            city: "City",
                            code: "Code",
                        },
                        signingCertificate: "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"
                    })
                })
                .then(signature => signature.toString());
    }
    
    "use strict";
    
    let signature = new XmlDSigJs.SignedXml();
    
    signature.Sign(                                  // Signing document
        { name: "RSASSA-PKCS1-v1_5" },                        // algorithm 
        keys.privateKey,                                      // key 
        XmlDSigJs.Parse(xml),                                 // document
        {                                                     // options
            keyValue: keys.publicKey,
            references: [
                { hash: "SHA-512", transforms: ["enveloped", "c14n"] },
            ]
        })
        .then(() => {
            console.log(signature.toString());       // <xml> document with signature
        })
        .catch(e => console.log(e));
    
        
    var SignedXml = require('xml-crypto').SignedXml	  
    , fs = require('fs');
    require( 'xml-crypto' ).SignedXml.enableHMAC();
    
    var xml = fs.readFileSync("../doc/initSessionSigned.xml");
    
    var sig = new SignedXml()
    sig.addReference("//*[local-name(.)='book']")    
    sig.signingKey = fs.readFileSync("../keys/openssl/certificate.crt")
    sig.computeSignature(xml)
    fs.writeFileSync("signed.xml", sig.getSignedXml())
    /*/
/*const xadesjs = require('xadesjs');
const { Crypto } = require('@peculiar/webcrypto');

const fs = require('fs');
const { Signature } = require('xmldsigjs');

xadesjs.Application.setEngine("NodeJS", new Crypto());
console.log('lol');

module.exports = function createKey() {
    
        let myPrivateKey, myPublicKey;
        xadesjs.Application.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([ 1, 0 , 1]),
            hash: { name: 'SHA-256'}
        },false,
        ['sign' , 'verify']
        ).then(function (keyPair) {
            myPrivateKey = keyPair.privateKey;
            myPublicKey = keyPair.publicKey;
            console.log("Stworzono klucz");
        return keyPair;
          
        })
            .catch(function (e) {
                console.error(e);
            });
        
    
   
}


module.exports = function SignXml(xmlFileContent, keys, algorithm) {
    return Promise.resolve()
        .then( () => {
            var xmlDoc = xadesjs.Parse(xmlFileContent);
            let signedXml = new xadesjs.SignedXml();

            return signedXml.Sign(
                algorithm,
                keys.privateKey,
                xmlDoc,{
                    keyValue: keys.publicKey,
                    references: [
                        { hash: "SHA-256", transforms: ["enveloped"] }
                    ],
                })
            })
            .then(function(){
            signature = toString(signature);
            console.log(signature);
            });
            
        }



SignedXml.Sign(algorithm: Algorithm, key: CryptoKey, data: Document, options?: OptionsXAdES): PromiseLike<Signature>;


var xadesjs = require("xadesjs");
var { Crypto } = require("@peculiar/webcrypto");
const fs = require('fs');

xadesjs.Application.setEngine("NodeJS", new Crypto());

// Generate RSA key pair
module.exports = function sign(){
    var privateKey, publicKey;
    xadesjs.Application.crypto.subtle.generateKey(
    {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 1024, //can be 1024, 2048, or 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-1" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["sign", "verify"] //can be any combination of "sign" and "verify"
)
    .then(function (keyPair) {
        // Push ganerated keys to global variable
        privateKey = keyPair.privateKey;
        publicKey = keyPair.publicKey;

        // Call sign function
        var xmlString = toString(fs.readFileSync("./doc/initSessionSign.xml"));
        console.log(xmlString)
        return SignXml(xmlString, keyPair, { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } });
    })
    .then(function (signedDocument) {
        console.log("Signed document:\n\n", signedDocument);
    })
    .catch(function (e) {
        console.error(e);
    });

}

    
function SignXml(xmlString, keys, algorithm) {
    return Promise.resolve()
        .then(() => {
            var xmlDoc = xadesjs.Parse(xmlString);
            var signedXml = new xadesjs.SignedXml();

            return signedXml.Sign(               // Signing document
                algorithm,                              // algorithm https://4programmers.net/Forum/Nietuzinkowe_tematy/355933-ksef_krajowy_system_e_faktur?page=12
                keys.privateKey,                        // key
                xmlDoc,                                 // document
                {                                       // options
                    keyValue: keys.publicKey,
                    references: [
                        { hash: "SHA-256", transforms: ["enveloped"] }
                    ],
                    productionPlace: {
                        country: "Country",
                        state: "State",
                        city: "City",
                        code: "Code",
                    },
                    signingCertificate: "MIIGgTCCBGmgAwIBAgIUeaHFHm5f58zYv20JfspVJ3hossYwDQYJKoZIhvcNAQEFBQAwgZIxCzAJBgNVBAYTAk5MMSAwHgYDVQQKExdRdW9WYWRpcyBUcnVzdGxpbmsgQi5WLjEoMCYGA1UECxMfSXNzdWluZyBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTE3MDUGA1UEAxMuUXVvVmFkaXMgRVUgSXNzdWluZyBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eSBHMjAeFw0xMzEwMzAxMjI3MTFaFw0xNjEwMzAxMjI3MTFaMHoxCzAJBgNVBAYTAkJFMRAwDgYDVQQIEwdCcnVzc2VsMRIwEAYDVQQHEwlFdHRlcmJlZWsxHDAaBgNVBAoTE0V1cm9wZWFuIENvbW1pc3Npb24xFDASBgNVBAsTC0luZm9ybWF0aWNzMREwDwYDVQQDDAhFQ19ESUdJVDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJgkkqvJmZaknQC7c6H6LEr3dGtQ5IfOB3HAZZxOZbb8tdM1KMTO3sAifJC5HNFeIWd0727uZj+V5kBrUv36zEs+VxiN1yJBmcJznX4J2TCyPfLk2NRELGu65VwrK2Whp8cLLANc+6pQn/5wKh23ehZm21mLXcicZ8whksUGb/h8p6NDe1cElD6veNc9CwwK2QT0G0mQiEYchqjJkqyY8HEak8t+CbIC4Rrhyxh3HI1fCK0WKS9JjbPQFbvGmfpBZuLPYZYzP4UXIqfBVYctyodcSAnSfmy6tySMqpVSRhjRn4KP0EfHlq7Ec+H3nwuqxd0M4vTJlZm+XwYJBzEFzFsCAwEAAaOCAeQwggHgMFgGA1UdIARRME8wCAYGBACLMAECMEMGCisGAQQBvlgBgxAwNTAzBggrBgEFBQcCARYnaHR0cDovL3d3dy5xdW92YWRpc2dsb2JhbC5ubC9kb2N1bWVudGVuMCQGCCsGAQUFBwEDBBgwFjAKBggrBgEFBQcLAjAIBgYEAI5GAQEwdAYIKwYBBQUHAQEEaDBmMCoGCCsGAQUFBzABhh5odHRwOi8vb2NzcC5xdW92YWRpc2dsb2JhbC5jb20wOAYIKwYBBQUHMAKGLGh0dHA6Ly90cnVzdC5xdW92YWRpc2dsb2JhbC5jb20vcXZldWNhZzIuY3J0MEYGCiqGSIb3LwEBCQEEODA2AgEBhjFodHRwOi8vdHNhMDEucXVvdmFkaXNnbG9iYWwuY29tL1RTUy9IdHRwVHNwU2VydmVyMBMGCiqGSIb3LwEBCQIEBTADAgEBMA4GA1UdDwEB/wQEAwIGQDAfBgNVHSMEGDAWgBTg+A751LXyf0kjtsN5x6M1H4Z6iDA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnF1b3ZhZGlzZ2xvYmFsLmNvbS9xdmV1Y2FnMi5jcmwwHQYDVR0OBBYEFDc3hgIFJTDamDEeQczI7Lot4uaVMA0GCSqGSIb3DQEBBQUAA4ICAQAZ8EZ48RgPimWY6s4LjZf0M2MfVJmNh06Jzmf6fzwYtDtQLKzIDk8ZtosqYpNNBoZIFICMZguGRAP3kuxWvwANmrb5HqyCzXThZVPJTmKEzZNhsDtKu1almYBszqX1UV7IgZp+jBZ7FyXzXrXyF1tzXQxHGobDV3AEE8vdzEZtwDGpZJPnEPCBzifdY+lrrL2rDBjbv0VeildgOP1SIlL7dh1O9f0T6T4ioS6uSdMt6b/OWjqHadsSpKry0A6pqfOqJWAhDiueqgVB7vus6o6sSmfG4SW9EWW+BEZ510HjlQU/JL3PPmf+Xs8s00sm77LJ/T/1hMUuGp6TtDsJe+pPBpCYvpm6xu9GL20CsArFWUeQ2MSnE1jsrb00UniCKslcM63pU7I0VcnWMJQSNY28OmnFESPK6s6zqoN0ZMLhwCVnahi6pouBwTb10M9/Anla9xOT42qxiLr14S2lHy18aLiBSQ4zJKNLqKvIrkjewSfW+00VLBYbPTmtrHpZUWiCGiRS2SviuEmPVbdWvsBUaq7OMLIfBD4nin1FlmYnaG9TVmWkwVYDsFmQepwPDqjPs4efAxzkgUFHWn0gQFbqxRocKrCsOvCDHOHORA97UWcThmgvr0Jl7ipvP4Px//tRp08blfy4GMzYls5WF8f6JaMrNGmpfPasd9NbpBNp7A=="
                })
            })
            .then(signature => signature.toString());
}

"use strict";

let signature = new XmlDSigJs.SignedXml();

signature.Sign(                                  // Signing document
    { name: "RSASSA-PKCS1-v1_5" },                        // algorithm 
    keys.privateKey,                                      // key 
    XmlDSigJs.Parse(xml),                                 // document
    {                                                     // options
        keyValue: keys.publicKey,
        references: [
            { hash: "SHA-512", transforms: ["enveloped", "c14n"] },
        ]
    })
    .then(() => {
        console.log(signature.toString());       // <xml> document with signature
    })
    .catch(e => console.log(e));

    
var SignedXml = require('xml-crypto').SignedXml	  
, fs = require('fs');
require( 'xml-crypto' ).SignedXml.enableHMAC();

var xml = fs.readFileSync("../doc/initSessionSigned.xml");

var sig = new SignedXml()
sig.addReference("//*[local-name(.)='book']")    
sig.signingKey = fs.readFileSync("../keys/openssl/certificate.crt")
sig.computeSignature(xml)
fs.writeFileSync("signed.xml", sig.getSignedXml())
/*/