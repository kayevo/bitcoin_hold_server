require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const User = require("./entity/User");
const Credential = require("./model/Credential");

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const email = req.get("email");
  const password = req.get("password");
  const credential = new Credential(email, password);

  if (email == undefined || password == undefined) {
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
    res.status(400).json();
  } else {
    try {
      User.find({ email: _email, password: _password }, function (err, user) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err });
        } else {
          console.log(docs);
          res.status(200).json(docs);
        }
      });
    } catch (error) {
      res.status(500).json();
    }
  }
});

app.listen(8080, () => console.log("Application started"));
