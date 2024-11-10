import React, { useState } from 'react';
import './Voting.css';

function Voting({ userId, userName, questionId }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [response, setResponse] = useState(null); // To show success/error message

    const handleVote = async (event) => {
        event.preventDefault(); // Prevent page refresh on form submit

        if (!selectedAnswer) {
            setResponse('Please select an answer before voting');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId, // The ID of the user casting the vote
                    questionId, // ID of the question being answered
                    answerId: selectedAnswer, // ID of the selected answer
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(`User ${userName} (ID: ${userId}) voted successfully with answer ID: ${selectedAnswer}`);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            setResponse('Error submitting vote');
        }
    };

    return (
        <div className="Voting">
            <h1>Vote on Question {questionId}</h1>

            <form onSubmit={handleVote}>
                <label>
                    <input
                        type="radio"
                        value="1" // Assuming 1 is the ID for "Yes" answer
                        checked={selectedAnswer === 1}
                        onChange={() => setSelectedAnswer(1)}
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        value="2" // Assuming 2 is the ID for "No" answer
                        checked={selectedAnswer === 2}
                        onChange={() => setSelectedAnswer(2)}
                    />
                    No
                </label>

                <button type="submit">Submit Vote</button>
            </form>

            {response && <p>{response}</p>} {/* Show success/error message */}
        </div>
    );
}

export default Voting;
