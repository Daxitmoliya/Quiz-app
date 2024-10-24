import "./App.css";
import React, { useEffect, useState, useMemo } from 'react';
import { Questionnaire } from './components';
import Timer from "./components/Timer";
import Change from "./components/Change";
import Start from "./components/Start";
import Timesup from "./components/Timesup";
import DoubleTime from "./components/DoubleTime";

const apiUrl = "https://opentdb.com/api.php?amount=100";
const myName = "Daxit Moliya";
const currentYear = new Date().getFullYear();

function App() {
  // User registration 
  const [userName, setUserName] = useState(null);

  // Question 
  const [questions, setQuestions] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);

  // Game 
  const [earnings, setEarnings] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [timer, setTimer] = useState(30);

  // Lifeline 
  const [doubleTimeUsed, setDoubleTimeUsed] = useState(false);
  const [changeUsed, setChangeUsed] = useState(false);

  
  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 },
        { id: 3, amount: 300 },
        { id: 4, amount: 500 },
        { id: 5, amount: 1000 },
        { id: 6, amount: 2000 },
        { id: 7, amount: 4000 },
        { id: 8, amount: 8000 },
        { id: 9, amount: 16000 },
        { id: 10, amount: 32000 },
      ].reverse(),
    []
  );

  // API
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions = data.results.map((question) => ({
          ...question,
          answers: [
            question.correct_answer,
            ...question.incorrect_answers,
          ].sort(() => Math.random() - 0.5),
        }));
        setQuestions(formattedQuestions);
      });
  }, []);

 
  const handleAnswer = (answer) => {
    if (answer === questions[currIndex].correct_answer) {
      
      setEarnings(prev => prev + moneyPyramid[10 - questionNumber].amount);
    }
  
    handleNextQuestion(true);
  };

  // Proceed to the next question
  const handleNextQuestion = (changeQuestion) => {
    if (questionNumber === 10) {
      setGameOver(true); 
    } else if (changeQuestion) {
      setQuestionNumber(prev => prev + 1); 
      setCurrIndex(prev => prev + 1); 
    }
  };

  // Render function
  return !userName ? (
    <div className="startScreen">
      <header>
        <h1>Welcome to <span className="big">QUIZ Game</span><br />an online quiz app</h1>
      </header>
      <Start setUsername={setUserName} />
      <footer>
        <p className="copyRight">Ⓒ Copyright, {myName} {currentYear}.</p>
      </footer>
    </div>
  ) : questions.length > 0 ? (
    <div className="app vh-100">
      <div className="main col-9">
        {gameOver ? (
          <h1>Game over! <br /> <span className="big">{userName}</span> earned: ★ {earnings} in total!</h1>
        ) : timeOut ? (
          <Timesup
            userName={userName}
            setTimeOut={setTimeOut}
            timeOut={timeOut}
            setGameOver={setGameOver}
            questionNumber={questionNumber}
            handleNextQuestion={handleNextQuestion}
          />
        ) : (
          <>
            
            <div className="top">
              <Timer
                setTimeOut={setTimeOut}
                questionNumber={questionNumber}
                timer={timer}
                setTimer={setTimer}
                changeUsed={changeUsed}
              />
              <Change
                changeUsed={changeUsed}
                setChangeUsed={setChangeUsed}
                handleNextQuestion={handleNextQuestion}
              />
              <DoubleTime
                doubleTimeUsed={doubleTimeUsed}
                setDoubleTimeUsed={setDoubleTimeUsed}
                timer={timer}
                setTimer={setTimer}
              />
            </div>
            
            <div className="bottom">
              <Questionnaire
                data={questions[currIndex]}
                handleAnswer={handleAnswer}
                setTimeOut={setTimeOut}
              />
            </div>
          </>
        )}
      </div>

   
      <div className="pyramid col-3">
        <div className="moneyList vh-100">
          {moneyPyramid.map((money) => (
            <div className={`moneyListItem row ${questionNumber === money.id ? 'active' : ''}`} key={money.id}>
              <div className="moneyListItemNumber col-3 d-flex align-items-center">
                {money.id}
              </div>
              <div className="moneyListItemAmount col-9 d-flex align-items-center">
                ★ {money.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <h2 className='big'>Loading...</h2>
  );
}

export default App;
