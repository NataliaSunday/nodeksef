const crypto = require('crypto');
const fs = require('fs');

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

    let pairOfKeys = {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        keyPair: keyPair
    }
  module.exports = {keyPair};
    return crypto.KeyObject.length;
   
}

if(fs.existsSync('../keys/myPublicublicKey.pem')){
console.log('istnieje');

}else{
    generateKeyFiles();
    console.log(generateKeyFiles())
    console.log('już istnieje');
}
