require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const UserEntity = require("./entity/UserEntity");
const Credential = require("./model/Credential");
const User = require("./model/User");
const emptyBody = {};

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const user = new User(req.query.email, req.query.password);

  if (user.email == undefined || user.password == undefined) {
    res.status(400).send(emptyBody);
  } else {
    try {
      await UserEntity.create(user);
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
      UserEntity.find(
        { email: credential.email, password: credential.password },
        function (err, user) {
          if (err) {
            res.status(500).send({ error: err });
          } else {
            if (user.length == 0) {
              res.status(404).send(emptyBody); // not found
            } else {
              res.status(200).send({ id: `${user[0]._id}` });
            }
          }
        }
      );
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/user/email", (req, res) => {
  const _email = req.query.email;

  if (_email == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.find({ email: _email }, function (err, user) {
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

app.get("/portfolio", (req, res) => {

  const _userId = req.query.userId;

  if (_userId == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.find({ _id: _userId }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (user.length == 0) {
            res.status(404).send(emptyBody); // not found
          } else {
            res.status(200).send(user[0].bitcoinPortfolio);
          }
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.listen(8080, () => console.log("Application started"));
