import React, { useState, useEffect } from 'react';

const Results = () => {
    const [results, setResults] = useState([]);
    const [polls, setPolls] = useState([]);
    const [users, setUsers] = useState([]);
    const [showVotersMode, setShowVoters] = useState(true);
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:3001/results/results');
                const data = await res.json();
                setResults(data);

            } catch (error) {
                console.error('Error fetching results in frontend: ', error);
            }
        };
        fetchResults();
    }, []);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await fetch('http://localhost:3001/results/polls');
                const data = await res.json();
                setPolls(data);

            } catch (error) {
                console.error('Error fetching polls in frontend: ', error);
            }
        }
        fetchPolls();
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
        results.map((r) => {
            if (r.questionId === question.id && r.answerId === answer.id) {
                counter++;
                voters.push(r.userId);
            }
            return 0;
        });
        return { counter, voters };
    }

    const showVoters = () => { setShowVoters(!showVotersMode)};

    return (
        <div>
        <h1>Polls and Questions</h1>
        {polls.map((poll) => (
            <div key={poll.id} className="poll">
            <h2>{poll.name}</h2>
            {poll.Questions && poll.Questions.map((question) => (
                <div key={question.id} className="question">
                <h4>{question.name}</h4>
                {question.Answers && question.Answers.map((answer) => (
                    <div key={answer.id} className="answer">
                    <p>{answer.name} {showVotersMode ?
                        showResults(results, question, answer).counter :
                        users.filter(u => showResults(results, question, answer).voters.includes(u.id)).map(u => u.name + ', ')
                    }</p>

                    </div>
                ))}
                </div>
            ))}
            </div>
        ))}
        <button onClick={showVoters}>{ showVotersMode ? ('Show voters') : ('Show count')}</button>
        </div>
    );
}

export default Results;
