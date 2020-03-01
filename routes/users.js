const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const mySqlConnection = require("../db/db")
let user

router.get("/", (req, res) => {
    if(!req.session.user) {
        res.status(200).sendFile(__dirname + '/login.html')
    } else res.status.send("Already LOgged In")
});

router.get("/register", (req, res) => {
    if (!req.session.user) {
        res.status(200).send('register form will be here')
    } else res.status(401).send("Not possible as you are logged in already")
})

router.post("/register", (req, res) => {
    const { name, email, password, password2, phone } = req.body
    let errors = []
  
    if (!name || !email || !password || !password2 || !phone) {
        errors.push({ msg: "Please enter all fields" })
    }
  
    if (password != password2) {
        errors.push({ msg: "Passwords do not match" })
    }
  
    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters" })
    }
    mySqlConnection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (rows.length) errors.push({ msg: "Email already exists" })
            if (errors.length > 0) {
            res.statusCode = 400
            res.send(errors)
            } else {
            pwdHash = bcrypt.hashSync(password, 10)
            var sql = `INSERT INTO users (name, email, phone, pwdHash) VALUES ?`
            const values = [[name, email, phone, pwdHash]]
    
            mySqlConnection.query(sql, [values], function(err) {
                if (err) res.status(500).send(err)
            })
            res.status(200).send("successfully registered")
        }
      },
    )
})

router.post("/login", (req, res) => {
    const { email, password } = req.body
    mySqlConnection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) res.status(500).send(err)
            user = rows[0]
            if (user) {
            const result = bcrypt.compareSync(password, user.pwdHash)
            if (result) {
                req.session.user = user
                res.redirect("/")
            } else {
                res.status(400).send("pwd incorrect")
            }
            } else {
            res.status(400).send("email does not exist")
            }
        },
    )
})

router.get('/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy(() => {
            res.status(200).send("logout successful")
        })
    } else {
        res.status(400).send("You are not logged in")
    }
})

module.exports = router