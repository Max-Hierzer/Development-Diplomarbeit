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
    console.log(results, polls)
    return (
        <div>

        </div>
    );
}

export default Results;
