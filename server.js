require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const User = require("./entity/User");
const Credential = require("./model/Credential");

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const credential = new Credential(req.get("email"), req.get("password"));

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).json();
  } else {
    try {
      await User.create(credential);
      res.status(201).json();
    } catch (error) {
      res.status(500).json();
    }
  }
});

app.get("/user", (req, res) => {
  const _email = req.get("email");
  const _password = req.get("password");

  if (_email == undefined || _password == undefined) {
    res.status(400).json(); // bad request
  } else {
    try {
      User.find({ email: _email, password: _password }, function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err });
        } else {
          if (user.length == 0) {
            res.status(401).json(); // unauthorized
          } else {
            res.status(200).json(user.id);
          }
        }
      });
    } catch (error) {
      res.status(500).json();
    }
  }
});

app.listen(8080, () => console.log("Application started"));
