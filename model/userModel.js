const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    email:  {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: validator.isEmail
    },
    phoneNumber: String,
    password: {
      type: String,
      required: true,
      minlength: 8,
      
  },
  
    profileImage: {
      type: String
    }
  });
  
  const User = mongoose.model('User', userSchema);

  
  module.exports = User;