// App.js
import React, { useState } from 'react';
import './styles/App.css';
import WriteMessages from './messages/WriteMessage';
import InputMessage from './messages/InputMessage';
import Register from './usermanagment/Register';
import Login from './usermanagment/Login';
import Results from './results/Results';
import Voting from './voting/Voting';

function App() {
  const [isInputMode, setIsInputMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showResultsMode, setShowResults] = useState(false);


  const handleLoginChange = (loginMode) => {
    setIsLoggedIn(loginMode);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        // Render the login component if the user is not logged in
        <div className='Usermanagement'>
          <h1>Welcome to the User Registration</h1>
          <Register />
          <Login loginChange={handleLoginChange} />
          <h2>Please log in to continue</h2>
        </div>
      ) : (
        // Render the main content if the user is logged in
        <div className='MainContent'>
          <div className='Logout'>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
          <button onClick={!showResultsMode ?
            () => setShowResults(true) :
            () => setShowResults(false)}>
            {showResultsMode ? 'Show results' : 'Show poll'}
          </button>
          {/*This is to Show the voting function*/}
          {showResultsMode ? (
            <Voting />
          ) : (
            <Results />
          )}

          <div className='Messenger'>
            <h1>{isInputMode ? 'Submit a Message' : 'Messages'}</h1>

            <button onClick={() => setIsInputMode(!isInputMode)}>
              Switch to {isInputMode ? 'View Messages' : 'Submit a Message'}
            </button>
            {isInputMode ? (
              // Input Form
              <InputMessage />
            ) : (
              // Output View: List of Messages
              <WriteMessages />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
