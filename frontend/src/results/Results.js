import React, { useState, useEffect } from 'react';

const Results = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/results');
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching results in frontend: ', error);
            }
        };
        fetchResults();
    }, []);

    return (
        <div>
            <h1>Results</h1>
            <p>{ results.filter(x => x.answerId === 1).length } voted for Ja</p>
            <p>{ results.filter(x => x.answerId === 2).length } voted for Nein</p>
        </div>
    );
}

export default Results;
