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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
