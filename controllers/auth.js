const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User.js');

exports.postSignUp = (req, res, next) => {
  User.findOne({
    name: req.body.name
  }).then(doc => {
    if(!doc) {
      bcrypt.hash(req.body.password, 12)
        .then(hashedPassword => {
          User.create({
            name: req.body.name,
            password: hashedPassword
          }).then(() => {
            res.status(201).end();
          }).catch(err => {
            res.status(500).end();
          });
        })
    }
    else {
      res.status(404).end();
    }
  }).catch(err => {
    res.status(500).end();
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({
    name: req.body.name
  }).then(doc => {
    if(doc) {
      bcrypt.compare(req.body.password, doc.password)
        .then(match => {
          if(match) {
            const expiration = new Date(new Date().getTime() + 1000 * 3600);
            const token = jwt.sign({
              name: doc.name,
              id: doc._id,
            }, process.env.TOKEN_SECRET, { expiresIn: "1h"} );

            const data = {
              birthdays: doc.birthdays,
              expirationDate: expiration
            };
            res.status(200).json({ token: token,  data: data });
          }
          else {
            res.status(401).end();
          }
        })
        .catch(err => {
          res.status(500).end();
        })
    }
    else {
      res.status(404).end();
    }
  }).catch(err => {
    console.log(err);
    res.status(500).end();
  });
};
