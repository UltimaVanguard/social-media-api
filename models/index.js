const { Schema, model } = require('mongoose');
const validator = require('validator');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      validate: {
        // validates that the email entered is an email
        validator: validator.isEmail,
        message: 'Please provide a valid email!',
      },
    },
    // array of thought ids
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
    ],
    // array of friends ids
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const User = model('user', userSchema);

module.exports = User;