import mongoose, { Schema, model } from "mongoose";

// interface User {
//   name: string;
//   classNumber: number;
//   email: string;
//   password: string;
//   phone: string;
//   dob: Date;
//   photo: string;
// }

const userSchema = new Schema
// <User>
({
  name: {
    type: String,
    required: true,
  },
  classNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date ,
    // required: true,
  },
  photo: {
    type: String,
  },
});

const UserModel = model("users", userSchema, "users");
// <User>


export default UserModel;
