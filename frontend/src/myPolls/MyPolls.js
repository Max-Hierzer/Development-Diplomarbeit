import React, { useState } from 'react';
<<<<<<< HEAD
import SHA256 from 'crypto-js/sha256';

function MyPoll({ pollId }) {
=======
import '../styles/myPolls.css';

function MyPoll({ pollId, pollName, isPublic, isAnonymous}) {
>>>>>>> fcf63e26 (styled myPolls)
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
<<<<<<< HEAD
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
=======
          <h2 className="pollname">{pollName}</h2>
          <h3 className="linkhead">Vote Link:</h3>
          <button onClick={() => copyClipboard(1)}>
            {copiedText === 1 ? 'Copied!' : 'Copy Link'}
          </button>
          <br />
          <br />
          <h3 className="linkhead">Results Link:</h3>
          <button onClick={() => copyClipboard(0)}>
            {copiedText === 0 ? 'Copied!' : 'Copy Link'}
          </button>
>>>>>>> fcf63e26 (styled myPolls)
        </div>
    );
}

export default MyPoll;
