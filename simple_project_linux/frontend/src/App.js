import React, { useState} from 'react';
import WriteMessages from './WriteMessage'
import GetMessage from './GetMessage'
import Register from './Register';



function App() {
  const [isInputMode, setIsInputMode] = useState(true); // Toggle input/output mode

  return (
    <div className="App">
    <h1>{isInputMode ? 'Submit a Message' : 'Messages'}</h1>

    <button onClick={() => setIsInputMode(!isInputMode)}>
    Switch to {isInputMode ? 'View Messages' : 'Submit a Message'}
    </button>

    {isInputMode ? (
      // Input Form
      <GetMessage />
    ) : (
      // Output View: List of Messages
      <WriteMessages />
    )}
    <div>
    <h1>Welcome to the User Registration</h1>
    <Register />
    </div>
    </div>
  );
}

export default App;
