// App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import WriteMessages from './messages/WriteMessage';
import InputMessage from './messages/InputMessage';
import Login from './usermanagment/Login';
import PollDashboard from './selectPolls/PollDashboard';
import CreatePoll from './createPolls/CreatePolls';

function App() {
  const [isPollMode, setIsPollMode] = useState(false);
  const [isInputMode, setIsInputMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || 0);
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');

  useEffect(() => {
    // Save login state to sessionStorage whenever it changes
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userName', userName);
  }, [isLoggedIn, userId, userName]);

  const handleLoginChange = (loginMode, userId, userName) => {
    setIsLoggedIn(loginMode);
    setUserId(userId);
    setUserName(userName);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(0);
    setUserName('');
    sessionStorage.clear(); // Clear session storage on logout
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        // Render the login component if the user is not logged in
        <div className='Usermanagement'>
          <div>
            <h1>Welcome to the User Login</h1>
            <Login loginChange={handleLoginChange} />
            <h2>Please log in to continue</h2>
          </div>
        </div>
      ) : (

        // Render the main content if the user is logged in
        <div className='MainContent'>
          <div className='Logout'>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <button onClick={() => setIsPollMode(!isPollMode)}>
            {isPollMode ? 'Back' : 'Create Poll'}
          </button>
          {!isPollMode ? (
            <div>
              <div>
                <PollDashboard userId={userId} userName={userName} />
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
