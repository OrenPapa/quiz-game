import { useEffect, useState } from "react";

const useVoting = (user) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [countdown, setCountdown] = useState(10);

  // Fetch question and answers
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch("http://localhost:5000/vote/question");
        const data = await response.json();
        setQuestion(data.question);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    };

    fetchQuestion();
  }, []);

  // Handle countdown and fetcht results after submission
  useEffect(() => {
    let timer, countdownInterval;

    if (submitted) {
      // Fetch results after 10 seconds
      timer = setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:5000/vote/results");
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Failed to fetch results:", error);
        }
      }, 10000);

      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) clearInterval(countdownInterval);
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [submitted]);

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return alert("Please select an answer");

    try {
      const response = await fetch("http://localhost:5000/vote/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user, answer: selectedAnswer }),
      });

      if (response.ok) {
        setSubmitted(true);
        setCountdown(10); // Reset countdown
      } else {
        const data = await response.json();
        alert(data.message || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  return {
    question,
    answers,
    selectedAnswer,
    submitted,
    results,
    countdown,
    handleSelectAnswer,
    handleSubmitAnswer,
  };
};

export default useVoting;
