require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const User = require("./entity/User");
const Credential = require("./model/Credential");
const emptyBody = {}

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const credential = new Credential(req.query.email, req.query.password);

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).send(emptyBody);
  } else {
    try {
      await User.create(credential);
      res.status(201).send(emptyBody);
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/user", (req, res) => {
  const credential = new Credential(req.query.email, req.query.password);

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      User.find(
        { email: credential.email, password: credential.password },
        function (err, user) {
          if (err) {
            res.status(500).send({ error: err });
          } else {
            if (user.length == 0) {
              res.status(404).send(emptyBody); // not found
            } else {
              res.status(200).send({id: `${user[0]._id}`});
            }
          }
        }
      );
    } catch (error) {
      res.status(500).send(emptyBody)
    }
  }
});

app.get("/user/email", (req, res) => {
  const _email = req.query.email;

  if (_email == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      User.find({ email: _email }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (user.length == 0) {
            res.status(404).send(emptyBody); // not found
          } else {
            res.status(200).send(emptyBody);
          }
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.listen(8080, () => console.log("Application started"));
