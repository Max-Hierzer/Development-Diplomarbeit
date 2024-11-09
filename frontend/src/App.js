// App.js
import React, { useState } from 'react';
import WriteMessages from './WriteMessage';
import InputMessage from './InputMessage';
import Register from './Register';
import Login from './Login';

function App() {
  const [isInputMode, setIsInputMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginChange = (loginMode) => {
    setIsLoggedIn(loginMode);
  };

  return (
    <div className="App">
    {!isLoggedIn ? (
      // Render the login component if the user is not logged in
      <div>
        <h1>Welcome to the User Registration</h1>
        <Register />
        <Login loginChange={handleLoginChange} />
        <h2>Please log in to continue</h2>
      </div>
    ) : (
      // Render the main content if the user is logged in
      <div>
        <button onClick={() => setIsLoggedIn(false)}>Logout</button>
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
    )}
    </div>
  );
}

export default App;