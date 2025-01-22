import React, { useState } from 'react';

function MyPoll({ pollId, isPublic, isAnonymous}) {
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
            <h3>Vote Link:</h3>
            <button onClick={() => copyClipboard(1)}>
                {copiedText === 1 ? "Copied!" : "Copy Link"}
            </button>
            <br />
            <br />
            <h3>Results Link:</h3>
            <button onClick={() => copyClipboard(0)}>
                {copiedText === 0 ? "Copied!" : "Copy Link"}
            </button>
            <br />
            <p>{response}</p>
            <br />
        </div>
    );
}

export default MyPoll;
