import React, { useState } from 'react';
import '../styles/myPolls.css';

function MyPoll({ pollId, pollName, isPublic, isAnonymous}) {
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
        </div>
    );
}

export default MyPoll;
