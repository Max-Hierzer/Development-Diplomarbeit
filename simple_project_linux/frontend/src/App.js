import React, { useState} from 'react';
import WriteMessages from './WriteMessage'
import InputMessage from './InputMessage'
import Register from './Register';
import Login from './Login';


function App() {
  const [isInputMode, setIsInputMode] = useState(true); // Toggle input/output mode

  return (
    <div className="App">
    <div>
    <h1>Welcome to the User Registration</h1>
    <Register />
    <Login />
    </div>
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
  );
}

export default App;
