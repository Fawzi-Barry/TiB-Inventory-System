const connectToMongo = require("./db");
connectToMongo();

const express = require("express");
const app = express();
const port = 3001;

const cors = require("cors");
const router = require("./Routes/router");
const authRouter = require("./Routes/auth");

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(router);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Inventory API listening on port ${port}`);
  });
}

module.exports = app;
