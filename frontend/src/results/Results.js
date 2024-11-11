import React, { useState, useEffect } from 'react';

const Results = () => {
    const [results, setResults] = useState([]);
    const [polls, setPolls] = useState([]);

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

    const countResults = (results, question, answer) => {
        let counter = 0;
        results.map((r) => {
            if (r.questionId === question.id && r.answerId === answer.id) counter++;
        });
        return counter;
    }

    console.log(results);
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
                    <p>{answer.name} {countResults(results, question, answer)}</p>
                    </div>
                ))}
                </div>
            ))}
            </div>
        ))}
        </div>
    );
}

export default Results;
