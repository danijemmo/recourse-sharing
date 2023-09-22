const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  profilePicture: {
    type: Buffer,
    required: true,
  },
  profilePictureType: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  social: {
    type: [String],
  },
  department:{
    type:String,
    required:true
  },
  joinedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

userSchema.virtual("profilePicturePath").get(function () {
  if (this.profilePicture != null && this.profilePictureType != null)
    return `data: ${
      this.profilePictureType
    };charset = utf-8; base64,${this.profilePicture.toString("base64")}`;
});

const Users = mongoose.model('users',userSchema)

function validation(user) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.number().min(10),
    profilePicture: Joi.required(),
    coverImageType: Joi,
    bio: Joi.string().min(1).max(255),
    social: Joi.string(),
    department: Joi.string().required(),
    joinedDate: Joi,
  };
  return Joi.validate(user,schema)
}

exports.Users = Users
exports.validation = validation
