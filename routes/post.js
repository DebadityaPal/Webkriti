const express = require("express")
const router = express.Router()
const mySqlConnection = require("../db/db")
var path = require('path')
let post
let user

router.get("/", (req, res) => {
    var name = ''
    if(req.session.user) {
        name = req.session.user.name
    }
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
                res.status(200).render(path.join(__dirname, '../index.ejs'), {posts: rows, user: name})
            }
        }
    )
});

router.get("/view", (req, res) => {
    const { id } = req.query
    console.log(req.query)
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

router.get("/edit", (req,res) => {
    const {id} = req.query
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

router.post("/edit", (req, res) => {
   const { id, title, body } = req.body
   console.log(req.body)
   let errors = []
   mySqlConnection.query(
       "UPDATE posts SET title = ?, body = ? WHERE id = ?",
       [title, body, id],
       (err, rows) => {
           if(err) res.status(500).send(err)
           else res.status(200).redirect("/posts")
       }
   ) 
});

// router.put("/edit", (req, res) => {
//     const { id, title, body } = req.query
//     console.log(title)
//     let errors = []
//     mySqlConnection.query(
//         "UPDATE posts SET title = ?, body = ? WHERE id = ?",
//         [title, body, id],
//         (err, rows) => {
//             if (err) res.status(500).send(err) 
//             if (errors.length > 0) {
//                 res.statusCode = 400
//                 res.send(errors)
//             } else {
//                 res.redirect("/posts")
//             }
//         }
//     )
// });

module.exports = router