const express = require("express");
const app = express();
const port = 3001;

const cors = require("cors");
const connectToMongo = require("./db");
const router = require("./Routes/router");
const authRouter = require("./Routes/auth");

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({ message: "Database connection is unavailable." });
  }
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/auth", authRouter);
app.use(router);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Inventory API listening on port ${port}`);
  });
}

module.exports = app;
