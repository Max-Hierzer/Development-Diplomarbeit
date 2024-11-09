import React, { useState, useEffect } from 'react';

const Results = () => {
    const [results, setResults] = useState([]);
    const [polls, setPolls] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

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
                setQuestions(data[0]?.Questions);
                setAnswers(data[0]?.Questions[0]?.Answers);
            } catch (error) {
                console.error('Error fetching polls in frontend: ', error);
            }
        }
        fetchPolls();
    }, []);


    console.log(questions);
    console.log(answers);

    return (
        <div>
        <h1> Results of { polls[0]?.name }</h1>
        <h2> { questions[0]?.name }</h2>
        { answers.map((answer) => (<p>{ answer.name }</p>))}
        </div>
    );
}

export default Results;
