const express = require('express');
const router = express.Router();

var path = require('path')

router.get('/', (req, res) => res.status(200).sendFile(path.join(__dirname, '../index.html')));

router.get('/dashboard', (req, res) => {
    if( req.session.user)
        res.status(200).send(req.session.user)
    else
        res.status(401).send('Login for this');
});

module.exports = router