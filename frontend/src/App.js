// App.js
import React, { useState } from 'react';
import './styles/App.css';
import WriteMessages from './messages/WriteMessage';
import InputMessage from './messages/InputMessage';
import Register from './usermanagment/Register';
import Login from './usermanagment/Login';
import PollDashboard from './selectPolls/PollDashboard';
import CreatePoll from './createPolls/CreatePolls';


function App() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isPollMode, setIsPollMode] = useState(false);
  const [isInputMode, setIsInputMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');

  const handleLoginChange = (loginMode, userId, userName) => {
    setIsLoggedIn(loginMode);
    setUserId(userId);
    setUserName(userName);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        // Render the login component if the user is not logged in
        <div className='Usermanagement'>
        <button onClick={() => setIsRegisterMode(!isRegisterMode)}>
        {isRegisterMode ? 'Back' : 'Register'}
        </button>
        {!isRegisterMode ? (
          <div>
            <h1>Welcome to the User Login</h1>
            <Login loginChange={handleLoginChange} />
            <h2>Please log in to continue</h2>
          </div>
        ) : (
          <div>
            <h1>Welcome to the User Registration</h1>
            <Register />
          </div>
        )}
        </div>
      ) : (
        // Render the main content if the user is logged in
        <div className='MainContent'>
          <div className='Logout'>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
          <button onClick={() => setIsPollMode(!isPollMode)}>
          {isPollMode ? 'Back' : 'Create Poll'}
          </button>
            {!isPollMode ? (
              <div>
                <div>
                  <PollDashboard userId = {userId} userName = {userName}/>
                </div>
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
            ) : (
              <CreatePoll />
            )}
        </div>
      )}
    </div>
  );
}

export default App;
