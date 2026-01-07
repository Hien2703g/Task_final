const mongoose = require("mongoose");
require("dotenv").config();

const Project = require("../../models/project.model");
const MONGO_URL =
  "mongodb+srv://Tranhien:123456ab@project-1.2nnbr97.mongodb.net/Task-management";
(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const projects = await Project.find({
      listUser: { $exists: true, $ne: [] },
    });

    for (const project of projects) {
      const newListUser = project.listUser.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      await Project.updateOne(
        { _id: project._id },
        { $set: { listUser: newListUser } }
      );

      console.log(`✔ Migrated project ${project._id}`);
    }

    console.log("🎉 MIGRATION DONE");
    process.exit(0);
  } catch (err) {
    console.error("❌ MIGRATION ERROR", err);
    process.exit(1);
  }
})();
