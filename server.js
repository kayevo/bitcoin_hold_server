require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const User = require("./entity/User");
const Credential = require("./model/Credential");

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const credential = new Credential(req.query.email, req.query.password);

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
  const credential = new Credential(req.query.email, req.query.password);

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).json(); // bad request
  } else {
    try {
      User.find(
        { email: credential.email, password: credential.password },
        function (err, user) {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            if (user.length == 0) {
              res.status(404).json(); // not found
            } else {
              res.status(200).send(JSON.stringify(user[0].email));
            }
          }
        }
      );
    } catch (error) {
      res.status(500).json();
    }
  }
});

app.get("/user/email", (req, res) => {
  const _email = req.query.email;

  if (_email == undefined) {
    res.status(400).json(); // bad request
  } else {
    try {
      User.find({ email: _email }, function (err, user) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          if (user.length == 0) {
            res.status(404).json(); // not found
          } else {
            res.status(200).json();
          }
        }
      });
    } catch (error) {
      res.status(500).json();
    }
  }
});

app.listen(8080, () => console.log("Application started"));
