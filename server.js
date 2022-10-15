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
  }

  try {
    await User.create(credential);
    res.status(201).json();
  } catch (error) {
    res.status(500).json();
  }
  //res.send(JSON.stringify(user));
});

app.get("/user", (req, res) => {
  const _email = req.get("email");
  const _password = req.get("password");
  // const credential = new Credential(_email, password);

  if (_email == undefined || _password == undefined) {
    res.status(400).json();
  }

  try {
    User.find({ email: _email }, { password: _password }, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(400).json();
      } else {
        console.log("Second function call : ", docs);
        res.status(200).json(docs);
      }
    });
    // res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
});

app.listen(8080, () => console.log("Application started"));
