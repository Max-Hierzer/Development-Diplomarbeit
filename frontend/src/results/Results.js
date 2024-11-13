import React, { useState, useEffect } from 'react';

const Results = ({ polls, selectedPoll }) => {
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [showVotersMode, setShowVoters] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:3001/results/results');
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching results in frontend:', error);
            }
        };
        fetchResults();
    }, []);

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

    const showResults = (results, question, answer) => {
        let counter = 0;
        let voters = [];
        results.forEach((r) => {
            if (r.questionId === question.id && r.answerId === answer.id) {
                counter++;
                voters.push(r.userId);
            }
        });
        return { counter, voters };
    };

    const discloseVoters = (results, question, answer, users) => {
        const voters = showResults(results, question, answer).voters;
        let voterNames = users.filter(u => voters.includes(u.id)).map(u => u.name);
        return voterNames;
    };

    const showVoters = () => setShowVoters(!showVotersMode);

    return (
        <div>
        {polls
            .filter((poll) => poll.id.toString() === selectedPoll)
            .map((poll) => (
                <div key={poll.id} className="poll">
                <h2>{poll.name}</h2>
                {poll.Questions && poll.Questions.map((question) => (
                    <div key={question.id} className="question">
                    <h3>{question.name}</h3>
                    {question.Answers && question.Answers.map((answer) => (
                        <div key={answer.id} className="answer">
                        <h4>{answer.name}</h4>
                        <h4>{showVotersMode
                            ? showResults(results, question, answer).counter
                            : discloseVoters(results, question, answer, users).join(', ')
                        }</h4>
                        <br />
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            ))}
            <button onClick={showVoters}>
            {showVotersMode ? 'Show voters' : 'Show count'}
            </button>
            </div>
    );
};

export default Results;
