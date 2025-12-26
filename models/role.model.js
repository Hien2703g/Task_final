const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    permissions: [
      {
        type: String,
        required: true,
        index: true,
      },
    ],

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

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
