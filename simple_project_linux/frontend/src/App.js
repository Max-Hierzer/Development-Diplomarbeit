import React, { useState, useEffect } from 'react';
import Register from './Register';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState([]); // State to hold messages
  const [isInputMode, setIsInputMode] = useState(true); // Toggle input/output mode

  // Fetch all messages when switching to output mode
  useEffect(() => {
    if (!isInputMode) {
      const fetchMessages = async () => {
        try {
          const res = await fetch('http://localhost:3001/api/messages');
          const data = await res.json();
          setMessages(data); // Update state with fetched messages
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [isInputMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(`Message saved with ID: ${data.id}`);
        setMessage('');
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setResponse('Error submitting message');
    }
  };

  return (
    <div className="App">
    <h1>{isInputMode ? 'Submit a Message' : 'Messages'}</h1>

    <button onClick={() => setIsInputMode(!isInputMode)}>
    Switch to {isInputMode ? 'View Messages' : 'Submit a Message'}
    </button>

    {isInputMode ? (
      // Input Form
      <form onSubmit={handleSubmit}>
      <label>
      Message:
      <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      />
      </label>
      <button type="submit">Submit</button>
      </form>
    ) : (
      // Output View: List of Messages
      <div>
      {response && <p>{response}</p>}
      <ul>
      {messages.map((msg) => (
        <li key={msg.id}>{msg.text}</li> // Display each message
      ))}
      </ul>
      </div>
    )}
    <div>
    <h1>Welcome to the User Registration</h1>
    <Register />
    </div>
    </div>
  );
}

export default App;
