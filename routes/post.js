const express = require("express")
const router = express.Router()
const mySqlConnection = require("../db/db")
var path = require('path')
let post

router.get("/", (req, res) => {
    console.log(req.body)
    let errors = []
    mySqlConnection.query(
        "SELECT * from posts",
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (!rows.length) errors.push({msg: "Something went wrong!"}) 
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            } else {
            res.status(200).render(path.join(__dirname, '../index.ejs'), {posts: rows})
            }
        }
    )
});

router.post("/view", (req, res) => {
    const { id } = req.body
    console.log(req.body)
    let errors = []
    mySqlConnection.query(
        "SELECT * from posts where id = ?",
        [id],
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (!rows.length) errors.push({msg: "Something went wrong!"}) 
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            } else {
            res.status(200).render(path.join(__dirname, './post.ejs'), {posts: rows})
            }
        }
    )
});

router.get("/create" , (req, res) => {
    res.status(200).sendFile(__dirname + '/createPost.html');
});
router.post("/create", (req, res) => {
    const {title, body} = req.body
    let errors = []

    if(!title) {
        errors.push({msg: "Enter a Title!"})
    }

    if(!body) {
        errors.push({msg: "Write something in the post"})
    }

    mySqlConnection.query(
        "SELECT * FROM users where id = ?",
        [req.session.user.id],
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (!rows.length) errors.push({msg: "Something went wrong!"}) 
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            } else {
                var sql = `INSERT INTO posts (title, body, author) VALUES ?`
                const values = [[title, body, req.session.user.name]]

                mySqlConnection.query(sql, [values], function(err) {
                    if (err) res.status(500).send(err)
                })
                res.status(200).send("successfully posted")
            }
        },
    )
});

router.post("/edit", (req,res) => {
    const {id} = req.body
    let errors = []
    mySqlConnection.query(
        "SELECT * from posts where id = ?",
        [id],
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (!rows.length) errors.push({msg: "Something went wrong!"}) 
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            } else {
                res.status(200).render(path.join(__dirname, './editPost.ejs'), {posts: rows})
            }
        }
    )
});

module.exports = router