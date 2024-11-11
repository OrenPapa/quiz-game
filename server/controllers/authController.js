const fs = require("fs");
const path = require("path");
const usersFilePath = path.join(__dirname, "../data/users.json");

const readUsers = () => JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

exports.login = (req, res) => {
  const { username } = req.body;
  console.log(`Received login request for username: ${username}`);

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const users = readUsers();
  const userExists = users.some((user) => user.username === username);
  console.log(`User exists: ${userExists}`);

  if (!userExists) {
    return res.status(404).json({ message: "User does not exist" });
  }

  res.status(200).json({ message: "Login successful", username });
};