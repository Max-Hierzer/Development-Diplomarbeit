import React, { useState } from 'react';

function MyPoll({ pollId, isPublic, isAnonymous}) {
    const [response, setResponse] = useState(null);

    const voteHash = encodeURIComponent(btoa(`public=${isPublic}&mode=vote&poll=${pollId}&anonymous=${isAnonymous}`));
    const resultsHash = encodeURIComponent(btoa(`public=${isPublic}&mode=results&poll=${pollId}&anonymous=${isAnonymous}`));

    let voteLink = `http://localhost:3000/?${voteHash}`;
    let resultsLink = `http://localhost:3000/?${resultsHash}`;
    console.log(atob(decodeURIComponent(voteHash)));

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
            <br />
            <p>{response}</p>
            <br />
        </div>
    );
}

export default MyPoll;
