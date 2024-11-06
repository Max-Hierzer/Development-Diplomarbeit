import React, {useState, useEffect} from 'react';

function WriteMessages() {
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState(null);

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

    return (
        <div className="WriteMessages">
            {response && <p>{response}</p>}
            <ul>
            {messages.map((msg) => (
            <li key={msg.id}>{msg.text}</li> // Display each message
            ))}
            </ul>
        </div>
    )
}

export default WriteMessages;
