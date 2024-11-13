import React, { useState } from 'react';
import './Voting.css';

function Voting({ userId, userName, polls, selectedPoll }) {
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
            <form onSubmit={handleVote}>
            {polls
                .filter((poll) => poll.id.toString() === selectedPoll)
                .map((poll) => (
                    <div key={poll.id} className="poll">
                    <h1>Vote on {poll.name}</h1>
                    {poll.Questions && poll.Questions.map((question) => (
                        <div key={question.id} className="question">
                        <h3>{question.name}</h3>
                        {question.Answers && question.Answers.map((answer) => (
                            <div key={answer.id} className="answer">
                            <label>
                            <input
                            type="radio"
                            value={answer.id} // Assuming 2 is the ID for "No" answer
                            checked={selectedAnswer === answer.id}
                            onChange={() => setSelectedAnswer(answer.id)}
                            />
                            {answer.name}
                            </label>
                            <br />
                            </div>
                        ))}
                        </div>
                    ))}
                    </div>
                ))}
                <button type="submit">Submit Vote</button>
            </form>

            {response && <p>{response}</p>} {/* Show success/error message */}
        </div>
    );
}

export default Voting;
