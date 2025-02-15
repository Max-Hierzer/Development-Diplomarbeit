import React, { useState, useEffect } from 'react';
import '../styles/results.css';

const Results = ({ poll, showVotersMode }) => {
    const [results, setResults] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:3001/results/results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pollId: poll.id,
                        questions: poll.Questions
                    }),
                });

                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching results in frontend:', error);
            }
        };

        fetchResults();
    }, [poll.id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pollId: poll.id,
                        questions: poll.Questions
                    }),
                });
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [poll.id]);


    return (
        <div className="results-container">
            <h2 className="poll-header">{poll.name}</h2>
            <h3>In dieser Umfrage haben {results.totalVotes || 0} Leute abgestimmt!</h3>
            <br />
            {poll.description && (
                <div>
                    <h4 className='description-header'>Description:</h4>
                    <h5 className='description'>{poll.description}</h5>
                </div>
            )}

            {poll.Questions.map((question) => (
                <div key={question.id} className="question">
                    <h3 className="question-header">
                        <span className="question-text">{question.name}</span>
                        <span className="question-type">{question.QuestionType.name}</span>
                    </h3>
                    <h4>Auf diese Frage haben {results.questionVotes?.[question.id] || 0} Leute abgestimmt!</h4>
                    <br />
                    {question.Answers.map((answer) => (
                        <div key={answer.id} className="results-answer">
                            <label>{answer.name}</label>
                            <h4 className='showResults'>
                                {showVotersMode
                                    ? `${results.answerPercentages?.[answer.id] || '0.00'} %`
                                    : `Voters: ${users?.[answer.id]?.length > 0 ? users[answer.id].join(', ') : "No Voters"}`
                                }
                            </h4>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Results;
