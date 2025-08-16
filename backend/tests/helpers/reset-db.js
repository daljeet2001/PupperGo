import mongoose from "mongoose";
import User from "../../models/user.model.js";
import dogwalkerModel from "../../models/dogwalker.model.js";

export default async () => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await User.deleteMany({}, { session });
      await dogwalkerModel.deleteMany({}, { session });
    });
  } finally {
    session.endSession();
  }
};
