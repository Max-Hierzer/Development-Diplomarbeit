// App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import WriteMessages from './messages/WriteMessage';
import InputMessage from './messages/InputMessage';
import Login from './usermanagment/Login';
import PollDashboard from './selectPolls/PollDashboard';
import PublicPolls from './publicPolls/publicPolls';

function App() {
  const [isInputMode, setIsInputMode] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || 0);
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [userRoleId, setUserRoleId] = useState(sessionStorage.getItem('userRoleId') || 0);
  const [isPublic, setIsPublic] = useState(null);

  useEffect(() => {
    // Save login state to sessionStorage whenever it changes
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('userRoleId', userRoleId);
  }, [isLoggedIn, userId, userName, userRoleId]);

  const handleLoginChange = (loginMode, userId, userName, userRoleId) => {
    setIsLoggedIn(loginMode);
    setUserId(userId);
    setUserName(userName);
    setUserRoleId(userRoleId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(0);
    setUserName('');
    setUserRoleId(0);
    sessionStorage.clear(); // Clear session storage on logout
  };


  useEffect(() => {
    const linkParam = new URLSearchParams(window.location.search);
    const hashed = linkParam.toString();
    const paddedVoteHash = hashed.padEnd(hashed.length + (4 - (hashed.length % 4)) % 4, '=');
    const unhashed = atob(paddedVoteHash);
    const params = new URLSearchParams(unhashed);
    const publicValue = params.get('public');

    if (publicValue === "true") {
      setIsPublic(1);
    } else {
      setIsPublic(0);
    }
    }, []);



  return (
    <div className="App">
      {!isPublic ?
        !isLoggedIn ? (
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
            <div>
              <div>
                <PollDashboard userId={userId} userName={userName} userRoleId = {userRoleId}/>
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
        </div>
        ) :
        (
          <PublicPolls  />
        )
      }
    </div>
  );
}

export default App;
