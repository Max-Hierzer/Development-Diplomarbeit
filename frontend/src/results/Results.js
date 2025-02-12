import React, { useState, useEffect } from 'react';
import '../styles/results.css';

const Results = ({ poll, showVotersMode }) => {
    const [results, setResults] = useState({});
    const [totalVotes, setTotalVotes] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const fetchedResults = {};
                let totalVotesCount = 0;

                for (const question of poll.Questions) {
                    for (const answer of question.Answers) {
                        const res = await fetch('http://localhost:3001/results/results', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                questionId: question.id,
                                answerId: answer.id,
                                pollId: poll.id
                            }),
                        });

                        const data = await res.json();
                        fetchedResults[answer.id] = data;
                        totalVotesCount = data.totalVotes;
                    }
                }

                setResults(fetchedResults);
                setTotalVotes(totalVotesCount);
            } catch (error) {
                console.error('Error fetching results in frontend:', error);
            }
        };

        fetchResults();
    }, [poll.id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/users');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);


    return (
        <div className="results-container">
            <h2 className="poll-header">{poll.name}</h2>
            <h3>In dieser Umfrage haben {totalVotes} Leute abgestimmt!</h3>
            <br />
            {poll.description && (
                <div>
                    <h4 className='description-header'>Description:</h4>
                    <h5 className='description'>{poll.description}</h5>
                </div>
            )}

            {poll.Questions.map((question) => {
                const questionVotes = question.Answers
                    .map(answer => results[answer.id]?.questionVotes)
                    .find(qv => qv !== undefined) || 0;

                return (
                    <div key={question.id} className="question">
                        <h3 className="question-header">
                            <span className="question-text">{question.name}</span>
                            <span className="question-type">{question.QuestionType.name}</span>
                        </h3>
                        <h4>Auf diese Frage haben {questionVotes} Leute abgestimmt!</h4>
                        <br />
                        {question.Answers.map((answer) => (
                            <div key={answer.id} className="results-answer">
                                <label>{answer.name}</label>
                                <h4 className='showResults'>
                                    {showVotersMode
                                        ? `${results[answer.id]?.percentage || '0.00'} %`
                                        : `Voters: ${users.map(u => u.name).join(', ')}`
                                    }
                                </h4>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Results;
