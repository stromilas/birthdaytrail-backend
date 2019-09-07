const User = require('../models/User.js');

exports.postBirthdays = (req, res, next) => {
  if(!req.body.name || !req.body.dob) {
    res.status(412).end();
  }

  const birthday = {
    name: req.body.name,
    dob: req.body.dob
  }

  User.findByIdAndUpdate(req.id, {$push: {birthdays: birthday}}, {new: true})
        .then(doc => {
          const data = {
            birthdays: doc.birthdays
          };
          res.status(200);
          res.json({data: data});
        })
        .catch(err => {
          console.log(err);
          res.status(500);
          res.json({message: 'Error saving birthday'});
        });
};

exports.getBirthdays = (req, res, next) => {
  User.findById(req.id)
        .then(doc => {
          if(doc) {
            const data = {
              birthdays: doc.birthdays
            };
            res.status(200).json({data: data});
          }
          else {
            res.status(404).json({message: 'No user found'});
          }
        })
        .catch(err => {
          res.status(500).json({message: 'Error while processing request'})
        });
};

exports.deleteBirthdays = (req, res, next) => {
  User.findById(req.id)
        .then(doc => {
          if(doc) {
            doc.birthdays = doc.birthdays.filter(b => b._id != req.body.birthdayId);
            doc.save();
            const data = {
              birthdays: doc.birthdays
            };
            res.status(201).json({data: data});
          }
          else {
            res.status(404).end();
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).end();
        });
};

exports.patchBirthdays = (req, res, next) => {
  User.findById(req.id)
        .then(doc => {
          if(doc) {
            var birthday = doc.birthdays.filter(b => b._id == req.body.birthdayId)[0];
            birthday.giftideas = req.body.giftideas || '';
            birthday.birthdayplan = req.body.birthdayplan;
            doc.save();
            const data = {
              birthdays: doc.birthdays
            };
            res.status(200).json({data: data});
          }
          else {
            res.status(404).end();
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).end();
        });
};
