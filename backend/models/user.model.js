import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
  },
  location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
      
    },
  notifications: [
    {
      message: String,
      date: String,
      dogwalkerId:String,
      expireAt: {
        type: Date,
        default: () => Date.now() + 3 * 24 * 60 * 60 * 1000,
      },
    },
  ],
  dog: {
    dogname: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female","Unknown"] },
    breed: { type: String, required: true, trim: true },
    dogSize: { type: String, required: true, enum: ["Small", "Medium", "Large"] },
    description: { type: String, trim: true, maxlength: 200 },
  },
});

userSchema.index({ "notifications.expireAt": 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model("user", userSchema);
export default User;
