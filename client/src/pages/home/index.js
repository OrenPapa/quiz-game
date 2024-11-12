import React from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/nav";
import useVoting from "./useVoting";
import "./style.css";

function HomePage() {
  const { user } = useAuth();
  const {
    question,
    answers,
    selectedAnswer,
    submitted,
    results,
    countdown,
    handleSelectAnswer,
    handleSubmitAnswer,
  } = useVoting(user);

  return (
    <>
      <Navbar />
      <div className="home_container">
        <h2 className="welcome_text">Welcome, {user}</h2>

        {question && (
          <div className="question_card">
            <h3 className="question_text">{question}</h3>
          </div>
        )}

        <div className="answers_container">
          {answers.map((answer, index) => (
            <div
              key={answer}
              className={`answer_card ${
                selectedAnswer === answer ? "selected_answer" : ""
              }`}
              onClick={() => handleSelectAnswer(answer)}
            >
              <p className="answer_text">
                {String.fromCharCode(65 + index)}. {answer}
              </p>
            </div>
          ))}
        </div>

        {!submitted && (
          <button className="submit_button" onClick={handleSubmitAnswer}>
            Submit Answer
          </button>
        )}

        {submitted && countdown > 0 && (
          <div className="countdown_display">
            <p className="countdown_text">{`Displaying results in ${countdown}`}</p>
          </div>
        )}

        {results && (
          <div className="results_container">
            <h3 className="results_title">Voting Results</h3>
            <ul className="results_list">
              {Object.keys(results.counts).map((answer) => (
                <li key={answer} className="result_item">
                  {answer} was selected {results.counts[answer]} times (
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
