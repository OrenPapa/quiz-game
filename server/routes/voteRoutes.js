const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.get("/question", voteController.getQuestion);
router.post("/submit", voteController.submitAnswer);
router.get("/results", voteController.getResults);

module.exports = router;
