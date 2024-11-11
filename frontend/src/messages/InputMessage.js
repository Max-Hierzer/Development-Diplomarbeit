import React, { useState } from 'react';

function InputMessage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);

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
        <div>
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
        </div>
    )
}

export default InputMessage;
