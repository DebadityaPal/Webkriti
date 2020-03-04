const express = require('express');
const router = express.Router();

var path = require('path')

router.get('/', (req, res) => {
    let blogPosts = [
        {
            title: 'Perk is for real!',
            body: '...',
            author: 1,
        },
        {
            title: 'Development continues...',
            body: '...',
            author: '1',
        },
        {
            title: 'Welcome to Perk!',
            body: '...',
            author: '1',
        },
        {
            title: 'This is my First Time',
            body: '...',
            author: '1',
        },
        {
            title: 'Oh boy Dev is so hard!',
            body: '...',
            author: '1',
        }
    ]
    res.status(200).render(path.join(__dirname, '../index.ejs'), { posts: blogPosts })
});

router.get('/dashboard', (req, res) => {
    if( req.session.user)
        res.status(200).send(req.session.user)
    else
        res.status(401).send('Login for this');
});

module.exports = router