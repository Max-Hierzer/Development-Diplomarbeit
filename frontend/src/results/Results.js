import React, { useState, useEffect } from 'react';
import '../styles/results.css';

const Results = ({ answer, question, showVotersMode, isPublic }) => {
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);

    // gets the data from UserData
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

    // gets all user data to display names
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

    // matches results to question and answers
    const showResults = (results, question, answer) => {
        let counter = 0;    // count how many have voted for option
        let voters = [];    // userIds who have voted for this question and answer
        console.log(results)
        results.forEach((r) => {
            if (r.questionId === question.id && r.answerId === answer.id) {
                counter++;
                voters.push(r.userId);
            }
        });
        return { counter, voters };
    };

    // returns the usernames who were matched showResults
    const discloseVoters = (results, question, answer, users) => {
        const voters = showResults(results, question, answer).voters;
        let voterNames = users.filter(u => voters.includes(u.id)).map(u => u.name);
        return voterNames;
    };



    return (
        <div>
            <div key={answer.id} className="answer">
                <h4>{answer.name}</h4>
                <h4 className='showResults'>{showVotersMode
                    ? showResults(results, question, answer).counter
                    : discloseVoters(results, question, answer, users).join(', ')
                }</h4>
            </div>
            </div>
    );
};

export default Results;
