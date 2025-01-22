import React, { useState } from 'react';
import '../styles/myPolls.css';

function MyPoll({ pollId, pollName, isPublic, isAnonymous}) {
    const [response, setResponse] = useState(null);
    const [copiedText, setCopiedText] = useState(null);

    const voteHash = encodeURIComponent(btoa(`public=${isPublic}&mode=vote&poll=${pollId}&anonymous=${isAnonymous}`));
    const resultsHash = encodeURIComponent(btoa(`public=${isPublic}&mode=results&poll=${pollId}&anonymous=${isAnonymous}`));

    let voteLink = `http://localhost:3000/?${voteHash}`;
    let resultsLink = `http://localhost:3000/?${resultsHash}`;
    console.log(atob(decodeURIComponent(voteHash)));

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const copyClipboard = async(type) => {
        if (type) {
            await navigator.clipboard.writeText(voteLink);
        } else {
            await navigator.clipboard.writeText(resultsLink);
        }

        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 1000);
    }


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
