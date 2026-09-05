const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { jwtSecret, requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({
      message:
        "Name, email, and a password of at least 6 characters are required.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });
    return res.status(201).json({
      token: createToken(user),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create the account." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ message: "The email or password is incorrect." });
    }

    return res.json({
      token: createToken(user),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in right now." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role createdAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load the profile." });
  }
});

router.get(
  "/users",
  requireAuth,
  requireRole("Administrator"),
  async (req, res) => {
    try {
      const users = await User.find({})
        .select("name email role createdAt")
        .sort({ name: 1 });
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Unable to load users." });
    }
  },
);

router.patch(
  "/users/:id/role",
  requireAuth,
  requireRole("Administrator"),
  async (req, res) => {
    const { role } = req.body;
    if (!["Staff", "Administrator"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Choose Staff or Administrator." });
    }

    try {
      if (req.params.id === req.user.id && role !== req.user.role) {
        return res
          .status(400)
          .json({ message: "Ask another administrator to change your role." });
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true },
      ).select("name email role createdAt");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Unable to update the role." });
    }
  },
);

module.exports = router;
