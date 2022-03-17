
const express = require('express');
const app = express();
const port = 3000;
const authChal = require('./req/authChall');


app.get('/', (req, res) => {
    res.send('Heloha');
})
app.get('/authChallange', (req, res) =>{
    res.send(authChal());
} )

app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
})

