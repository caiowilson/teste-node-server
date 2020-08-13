const db = require("../models");


exports.allAccess = (req, res) => {
  res.status(200).send("free");
};

exports.userContent = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminContent = (req, res) => {
  res.status(200).send("Admin Content.");
};
