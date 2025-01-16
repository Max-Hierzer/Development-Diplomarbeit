import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';

function MyPoll({ pollId }) {
    const [response, setResponse] = useState(null);

    //const hashedPollId = SHA256(pollId.toString()).toString();
    const voteHash = btoa(`mode=vote&poll=${pollId}`).replace(/=*$/, '');
    const resultsHash =btoa(`mode=results&poll=${pollId}`).replace(/=*$/, '');

    let voteLink = `http://localhost:3000/?${voteHash}`;
    let resultsLink = `http://localhost:3000/?${resultsHash}`;
    console.log(atob(voteHash));

    const handleSubmit = async (event) => {
        event.preventDefault();
    };



    return (
        <div>
            <h3>Vote Link:</h3>
            <br />
            <h5>{voteLink}</h5>
            <br />
            <br />
            <h3>Results Link:</h3>
            <br />
            <h5>{resultsLink}</h5>
            <p>{response}</p>
            <br />
        </div>
    );
}

export default MyPoll;
