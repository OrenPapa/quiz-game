import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function HomePage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null); // State to store voting results
  const [countdown, setCountdown] = useState(10); // Countdown timer state

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

  // Timer to fetch results after countdown ends
  useEffect(() => {
    let timer, countdownInterval;

    if (submitted) {
      timer = setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:5000/vote/results");
          const data = await response.json();
          setResults(data); // Store the results
        } catch (error) {
          console.error("Failed to fetch results:", error);
        }
      }, 10000); // 10 seconds in milliseconds

      // Countdown interval
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval); // Clear countdown at 0
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(timer); // Clear timer on component unmount
      clearInterval(countdownInterval); // Clear countdown interval on unmount
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
        setCountdown(10); // Start countdown at 10 seconds
        alert("Answer submitted successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Welcome, {user}</h2>

        {question && (
          <div>
            <h3>{question}</h3>
            <ul>
              {answers.map((answer) => (
                <li key={answer}>
                  <label>
                    <input
                      type="radio"
                      name="answer"
                      value={answer}
                      checked={selectedAnswer === answer}
                      onChange={() => handleSelectAnswer(answer)}
                      disabled={submitted}
                    />
                    {answer}
                  </label>
                </li>
              ))}
            </ul>
            {!submitted && (
              <button onClick={handleSubmitAnswer}>Submit Answer</button>
            )}
            {submitted && <p>Thank you! Your answer has been recorded.</p>}
          </div>
        )}

        {/* Display countdown timer after submission */}
        {submitted && countdown > 0 && (
          <div>
            <p>Showing results in: {countdown} seconds</p>
          </div>
        )}

        {/* Display results after 10 seconds */}
        {results && (
          <div>
            <h3>Voting Results</h3>
            <ul>
              {Object.keys(results.counts).map((answer) => (
                <li key={answer}>
                  Answer {answer} selected {results.counts[answer]} times (
                  {results.percentages[answer]}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
