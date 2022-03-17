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

const file = fs.createReadStream('initSessionToken.xml');
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