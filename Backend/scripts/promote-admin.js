const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../Models/User");

dotenv.config({ path: path.join(__dirname, "..", "atlas-credentials.env") });

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run promote-admin -- user@example.com");
  process.exit(1);
}

async function promoteAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email },
      { role: "Administrator" },
      { new: true },
    ).select("name email role");

    if (!user) {
      console.error(`No user found for ${email}.`);
      process.exitCode = 1;
      return;
    }

    console.log(`${user.email} is now ${user.role}.`);
  } finally {
    await mongoose.disconnect();
  }
}

promoteAdmin().catch((error) => {
  console.error("Unable to promote user:", error.message);
  process.exitCode = 1;
});
