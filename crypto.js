
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
/*
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