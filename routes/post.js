const express = require("express")
const router = express.Router()
const multer = require("multer")
const mySqlConnection = require("../db/db")
var path = require('path')
let post
let user

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
    storage: multer.diskStorage({
        destination: function(req, file, next){
            next(null, './public/images');
        },
        filename: function(req, file, next){
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, req.body.title + '-' + req.session.user.id + '.'+ext);
        }
    }),
    fileFilter: function(req, file, next){
            if(!file){
            next();
            }
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('photo uploaded');
            next(null, true);
        }else{
            console.log("file not supported");
            return next();
        }
    }
};

router.get("/", (req, res) => {
    var id = ''
    if(req.session.user) {
        id = req.session.user.id
    }
    let errors = []
    mySqlConnection.query(
        "SELECT * from posts",
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            } else {
                res.status(200).render(path.join(__dirname, '../index.ejs'), {posts: rows, user: id})
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
router.post("/create", multer(multerConfig).single('photo'), (req, res) => {
    const {title, body} = req.body

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let createdDate = date + "-" + month + "-" + year;
    let createdTime = hours + ":" + minutes + ":" + seconds;
    let errors = []

    if(!title) {
        errors.push({msg: "Enter a Title!"})
    }

    if(!body) {
        errors.push({msg: "Write something in the post"})
    }

    mySqlConnection.query(
        "SELECT * FROM posts where author = ? AND title = ?",
        [req.session.user.id, title],
        (err, rows) => {
            if(rows.length) errors.push({msg: "Same titled post by you already exists"})
            if (errors.length > 0) {
                res.statusCode = 400
                res.send(errors)
            }
            else {
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
                            var sql = `INSERT INTO posts (title, body, author, createdDate, createdTime, modified) VALUES ?`
                            const values = [[title, body, req.session.user.id, createdDate, createdTime, createdDate]]
            
                            mySqlConnection.query(sql, [values], function(err) {
                                if (err) res.status(500).send(err)
                            })
                            res.redirect("/")
                        }
                    },
                )
            }
        }
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
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let modified = date + "-" + month + "-" + year;
    let errors = []
   mySqlConnection.query(
       "UPDATE posts SET title = ?, body = ?, modified = ? WHERE id = ?",
       [title, body, modified, id],
       (err, rows) => {
           if(err) res.status(500).send(err)
           else res.status(200).redirect("/posts")
       }
   ) 
});

module.exports = router