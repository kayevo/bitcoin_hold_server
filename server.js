class Credential {
    constructor(_email, _password) {
      this.email = _email;
      this.password = _password;
    }
  }

const express = require("express")
const mongoose = require("mongoose")
const databaseConnection = require('./database')

databaseConnection()

const app = express()

app.post('/user', (req, res) =>{
    const email = req.get("email")
    const password = req.get("password")
    const user = new Credential(email, password)
    // res.send("Email: " + email + "\n Password: " + password)
    res.send(JSON.stringify(user))
})

app.listen(8080, () => console.log("Opened"))