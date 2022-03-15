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