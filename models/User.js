const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  subscriptions: [
    {
      endpoint: String,
      expirationTime: Date,
      keys: {
        p256dh: String,
        auth: String
      }
    }
  ],
  birthdays: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
      },
      name: {
        type: String,
        required: true
      },
      relation: {
        type: String,
        default: ''
      },
      dob: {
        type: Date,
        required: true
      },
      birthdayplan: {
        type: String,
        default: ''
      },
      giftideas: {
        type: Array,
        default: [' ']
      },
      notified: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
