import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState([]); // State to hold the messages

  // Fetch all messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/messages');
        const data = await res.json();
        setMessages(data); // Update the state with fetched messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array to run only once on mount

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
        // Fetch messages again to update the list
        const fetchMessages = async () => {
          const res = await fetch('http://localhost:3001/api/messages');
          const data = await res.json();
          setMessages(data);
        };
        fetchMessages();
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
    <h1>Submit a Message</h1>
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
    {response && <p>{response}</p>}

    <h2>Messages</h2>
    <ul>
    {messages.map((msg) => (
      <li key={msg.id}>{msg.text}</li> // Display each message
    ))}
    </ul>
    </div>
  );
}

export default App;
