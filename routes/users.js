const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const mySqlConnection = require("../db/db")
var path = require("path")
let user
let conditionval = "none"
let emailval = null
let nameval = null
let phoneval = null
let message = ""

router.get("/", (req, res) => {
    if(!req.session.user) {
        res.status(200).render(path.join(__dirname, './login.ejs'), {email: emailval, condition: conditionval})
    } else res.redirect("/")
});

router.get("/register", (req, res) => {
    if (!req.session.user) {
        res.status(200).render(path.join(__dirname, './register.ejs'), {email: emailval, name: nameval, phone: phoneval, condition: conditionval, message: message})
    } else res.redirect("/")
})

router.post("/register", (req, res) => {
    const { name, email, password, password2, phone } = req.body
    emailval = email
    nameval = name
    phoneval = phone
    let errors = []
  
    if (password != password2) {
        message = "Passwords do not match"
        conditionval = "block"
        errors.push("Passwords do not match")
    }
  
    if (password.length < 6) {
        message = "Passwords needs to be longer than 6 letters"
        conditionval = "block"
        errors.push("Passwords needs to be longer than 6 letters")
    }
    mySqlConnection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) res.status(500).send(err)
            if (rows.length) {
                message = "Email already exists"
                conditionval = "block"
                errors.push("Email already exists")
            }
            if (errors.length > 0) {
            res.statusCode = 400
            res.redirect("/users/register")
            } else {
            pwdHash = bcrypt.hashSync(password, 10)
            var sql = `INSERT INTO users (name, email, phone, pwdHash) VALUES ?`
            const values = [[name, email, phone, pwdHash]]

            mySqlConnection.query(sql, [values], function(err) {
                if (err) res.status(500).send(err)
            })
            mySqlConnection.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, rows) => {
                    if (err) res.status(500).send(err)
                    user = rows[0]
                    req.session.user = user
                    nameval = null
                    conditionval = "none"
                    phoneval = null
                    emailval = null
                    message = ""
                    res.redirect("/")
                }
            )
        }
      },
    )
})

router.post("/login", (req, res) => {
    const { email, password } = req.body
    emailval = email
    mySqlConnection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) res.status(500).send(err)
            user = rows[0]
            console.log(user)
            if (user) {
            const result = bcrypt.compareSync(password, user.pwdHash)
            if (result) {
                req.session.user = user  
                emailval = null
                conditionval = "none"
                res.redirect("/")
            } else {
                conditionval = "block"
                res.redirect("/")
            }
            } else {
                conditionval = "block"
                res.redirect("/")
            }
        },
    )
})

router.get('/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy(() => {
            res.status(200).redirect("/")
        })
    } else {
        res.status(200).redirect("/")
    }
})

module.exports = router
