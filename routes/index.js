const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var User = require("../model/User");

router.get("/api", (req, res) => {
  res.status(200).send({ message: "server is up" });
});

module.exports = router;
