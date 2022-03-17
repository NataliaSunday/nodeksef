
const express = require('express');
const app = express();
const port = 3000;
const authChal = require('./req/authChall');
const authChal2 = require('./req/authChall2');

app.get('/', (req, res) => {
    res.send('Heloha');
})
app.get('/authChallange', (req, res) =>{
    res.send(authChal());
})
app.get('/authChallange2', (req, res) =>{
    res.send(authChal2());
})
app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
})

