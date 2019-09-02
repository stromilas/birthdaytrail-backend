const mongoose = require('mongoose');
const webpush = require('web-push');
const User = require('./models/User');
const date = require('./date.js');


module.exports = (interval) => {
	setInterval(loop, interval);
}

const PRIV_KEY = 'XEH9apJ2rW6aPdxEQVPPXzedKAat5sgDw4PmB_VakHc';
const PUB_KEY = 'BD04DSiATJCOJVyvhqrx3ym1cB0G3sUeXMGWtEoX6-SJvON-_Xdlfj_F2ImP4hHS5ySCGpUja4u44f8OcatO-gw';
const MAIL = 'mailto:js16968@essex.ac.uk';
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

						if(daysLeft < 14 && !birthday.notified) {
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
						console.log('Saved user');
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
		.then(() => {
			console.log('Notification sent!');
		})
		.catch(err => {
			console.log(err);
		});
}
