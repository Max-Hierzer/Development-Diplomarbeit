import React, { useState } from 'react';

function InputMessage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);

    // connects to backend
    const handleSubmit = async (event) => {
        event.preventDefault(); // doesnt reload page on submit

        try {
            const res = await fetch('http://localhost:3001/api/message', {  // connects to api
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message }),                    // passes message in res body
            });

            const data = await res.json();                                  // data = response from backend
            if (res.ok) {                                                   // check if backend got the data
                setMessage('');                                             // removes input data from inputbox
            } else {
                setResponse(`Error: ${data.error}`);                        // write error response from backend for debugging
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
                        onChange={(e) => setMessage(e.target.value)} // changes message to send if typed in
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default InputMessage;
