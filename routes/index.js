const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.status(200).send('home-page'));

router.get('/dashboard', (req, res) => {
    if( req.session.user)
        res.status(200).send(req.session.user)
    else
        res.status(401).send('Login for this');
});

module.exports = router