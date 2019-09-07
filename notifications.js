const mongoose = require('mongoose');
const webpush = require('web-push');
const User = require('./models/User');
const date = require('./date.js');
require('dotenv').config();

module.exports = (interval) => {
  setInterval(loop, interval);
}

const PRIV_KEY = process.env.PRIV_KEY
const PUB_KEY = process.env.PUB_KEY;
const MAIL = process.env.MAIL;
const NOTIF_DAY_RANGE = 7;

var loopHasFinished = true;

webpush.setVapidDetails(MAIL, PUB_KEY, PRIV_KEY);

function loop() {
  if(!loopHasFinished) return;
  loopHasFinished = false;

  User.find({})
    .then(users => {
      users.forEach((user) => {
        if(subscriptionExists(user)) {
          let userModified = false;

          user.birthdays.forEach((birthday) => {
            const daysLeft = Math.ceil(date.getDays(birthday.dob));

            if(daysLeft < NOTIF_DAY_RANGE && !birthday.notified) {
              user.subscriptions.forEach((sub) => {
                sendNotification(sub, birthday, daysLeft);
              });
              birthday.notified = true;
              userModified = true;
            }
            else if(daysLeft > 300 && birthday.notified) {
              birthday.notified = false;
              userModified = true;
            }
          });

          if(userModified) {
            user.save();
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
    });

  loopHasFinished = true;
}

function subscriptionExists(user) {
  if(user.subscriptions.length > 0) return true;
  else return false;
}

function sendNotification(subscription, birthday, daysLeft) {
  const payload = JSON.stringify({
    title: birthday.name + ' birthday is approaching!',
    content: daysLeft + ' days left until ' + birthday.name + '\'s birthday',
  });

  webpush.sendNotification(subscription, payload)
    .catch(err => {
      console.log(err);
    });
}
