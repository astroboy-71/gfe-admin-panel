import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // user unique id
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    verified: Boolean,

    image: {
      type: String,
    },

    resendCount: {
      type: Number,
      default: 0,
    },

    password: String,
    balance: Number,
  },
  { timestamps: true },
);

export default mongoose.models?.Users || mongoose.model("Users", userSchema);
