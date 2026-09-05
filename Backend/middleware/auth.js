const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing from the backend environment.");
}

async function requireAuth(req, res, next) {
  const authorization = req.header("Authorization");
  const token =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decodedUser = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedUser.id).select("name email role");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Your account no longer exists." });
    }
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please log in again." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Administrator access is required." });
    }
    next();
  };
}

module.exports = { jwtSecret, requireAuth, requireRole };
