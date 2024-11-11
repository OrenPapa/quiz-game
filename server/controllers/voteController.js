const fs = require("fs");
const path = require("path");

const questionsFilePath = path.join(__dirname, "../data/questions.json");
const responsesFilePath = path.join(__dirname, "../data/responses.json");

const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeFile = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

exports.getQuestion = (req, res) => {
  const questionData = readFile(questionsFilePath);
  res.status(200).json(questionData);
};

exports.submitAnswer = (req, res) => {
  const { username, answer } = req.body;

  if (!username || !answer) {
    return res
      .status(400)
      .json({ message: "Username and answer are required" });
  }

  const responses = readFile(responsesFilePath);
  const userResponse = responses.find(
    (response) => response.username === username
  );

  if (userResponse) {
    return res.status(403).json({ message: "User has already voted" });
  }

  responses.push({ username, answer });
  writeFile(responsesFilePath, responses);

  res.status(200).json({ message: "Vote submitted successfully" });
};

exports.getResults = (req, res) => {
  const responses = readFile(responsesFilePath);
  const questionData = readFile(questionsFilePath);

  // Initialize counts for each answer in questions.json
  const counts = questionData.answers.reduce((acc, answer) => {
    acc[answer] = 0;
    return acc;
  }, {});

  // Count each answer
  responses.forEach((response) => {
    if (counts[response.answer] !== undefined) {
      counts[response.answer]++;
    }
  });

  // Calculate percentages
  const totalVotes = responses.length;
  const percentages = Object.keys(counts).reduce((acc, answer) => {
    acc[answer] = totalVotes
      ? ((counts[answer] / totalVotes) * 100).toFixed(2)
      : "0.00";
    return acc;
  }, {});

  res.status(200).json({ counts, percentages });
};
