const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      // select: false,
    },

    token: {
      type: String,
      default: () => generate.generateRandomString(32),
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
      index: true,
    },
    deletedBy: String,
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Account", accountSchema, "accounts");
