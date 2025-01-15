import React, { useState } from 'react';

function MyPoll({ pollId }) {
    const [response, setResponse] = useState(null);
    let voteLink = `http://localhost:3000/?mode=vote&poll=${pollId}`;
    let resultsLink = `http://localhost:3000/?mode=results&poll=${pollId}`;

    const handleSubmit = async (event) => {
        event.preventDefault();
    };



    return (
        <div>
            <h3>Vote Link:</h3>
            <br />
            <h4>{voteLink}</h4>
            <br />
            <br />
            <h3>Results Link:</h3>
            <br />
            <h4>{resultsLink}</h4>
            <p>{response}</p>
            <br />
        </div>
    );
}

export default MyPoll;
