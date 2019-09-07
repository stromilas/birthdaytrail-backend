const User = require('../models/User.js');

exports.postSubscription = (req, res, next) => {
  if(req.body.subscription) {
    User.findById(req.id)
      .then(doc => {
          doc.subscriptions.push(req.body.subscription);
          doc.save()
            .then(() => {
              res.status(204).end();
            });
      })
      .catch(err => {
        res.status(500).end();
      });
  }
};
