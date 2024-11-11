const express = require("express");
const cors = require("cors"); // Add this import
const app = express();
const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/vote", voteRoutes);

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});

module.exports = app;
