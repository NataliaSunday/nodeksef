
const nodeRSA = require('node-rsa');
const fs = require('fs');
const key = new nodeRSA({b:1024});

module.exports =  function encrypt(time){


const publicKey = fs.readFileSync("./Keys/publicKeyKSEF.pem");
const privateKey = fs.readFileSync("./Keys/privateKey.pem");

let key_public = new nodeRSA(publicKey);
let key_private = new nodeRSA(privateKey);


let encryptedString = key_public.encrypt(time, 'base64');
console.log(encryptedString);

return encryptedString;
  
}
/*
const crypto = require('crypto');
const fs = require('fs');
const buffer = require('buffer');

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
    fs.writeFileSync('publicKey', keyPair.publicKey);
}
generateKeyFiles();

function encryptXML(file, publicKeyFile){
    const publicKey = fs.readFileSync(publicKeyFile, 'utf8');

    const encrypted = crypto.publicEncrypt(
        publicKey, Buffer.from(file)
        );
        return encrypted;
}

const file = fs.createReadStream('initSessionSigned.xml');
const encrypted = encryptXML(file, 'publicKeyKSEF.pem');

onsole.log("Buffer: ", encrypted);

const crypto = require('crypto');
const buffer = require('buffer');
const fs = require('fs');

const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});
const file = fs.readFileSync('initSessionToken.xml');
const data = Buffer.from(file);
console.log(`File content: ${data}`);
const sign = crypto.sign('SHA256', data, privateKey);
const signature = sign.toString('base64');
console.log(`Signature:\n\n ${signature}`);

const nodeRSA = require('node-rsa');
const fs = require('fs');
const key = new nodeRSA({b:1024});

module.exports =  function encrypt(time){
  let secret = fs.readFileSync("initSessionToken.xml");


const publicKey = fs.readFileSync("publicKeyKSEF.pem");
const privateKey = fs.readFileSync("privateKey.pem");

let key_public = new nodeRSA(publicKey);
let key_private = new nodeRSA(privateKey);


let encryptedString = key_public.encrypt(secret);
console.log(encryptedString);

fs.writeFile('initSessionTokenENCRYPTED.xml', encryptedString, function(err){
    if (err) 
    return console.log(err);
    console.log('Stworzono dokument zakodowany');
    console.log(time);
  });
  
}
----------------------
var encryptedString = key.encrypt(secret, 'base64');
console.log(encryptedString);

let publicKey = key.exportKey('public');
let privateKey = key.exportKey('private');

console.log(publicKey + '\n' + privateKey);

fs.writeFile('publicKey.pem', publicKey, function(err){
    if (err) 
    return console.log(err);
    console.log('Zapisano klucz');
  });
  fs.writeFile('privateKey.pem', privateKey, function(err){
    if (err) 
    return console.log(err);
    console.log('Zapisano klucz');
  });
/*/