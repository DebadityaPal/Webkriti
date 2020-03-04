const express = require('express');
const router = express.Router();

var path = require('path')

router.get('/', (req, res) => {
    if(req.session.user) {
        res.redirect("/posts")
    } else {
        res.redirect("/users")
    }
});

module.exports = router