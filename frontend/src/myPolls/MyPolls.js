import React, { useState } from 'react';
import '../styles/myPolls.css';

function MyPoll({ pollId, pollName, isPublic, isAnonymous}) {
    const [response, setResponse] = useState(null);
    const [copiedText, setCopiedText] = useState(null);

    const voteHash = encodeURIComponent(btoa(`public=${isPublic}&mode=vote&poll=${pollId}&anonymous=${isAnonymous}`));
    const resultsHash = encodeURIComponent(btoa(`public=${isPublic}&mode=results&poll=${pollId}&anonymous=${isAnonymous}`));

    let voteLink = `http://localhost:3000/?${voteHash}`;
    let resultsLink = `http://localhost:3000/?${resultsHash}`;

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
        <div className="my-polls">
          <h2 className="pollname">{pollName}</h2>
          <div className="votelink-container">
            <h3 className="link-label">Link zur <br /> Abstimmung:</h3>
            <button onClick={() => copyClipboard(1)} className="copy-button">
              {copiedText === 1 ? 'Kopiert!' : 'Link koperien'}
            </button>
          </div>
          <div className="resultslink-container">
            <h3 className="link-label">Link zu den <br /> Ergebnissen:</h3>
            <button onClick={() => copyClipboard(0)} className="copy-button">
              {copiedText === 0 ? 'Kopiert!' : 'Link koperien'}
            </button>
          </div>
          <button className="delete-button">Löschen</button>
        </div>
    );
}

export default MyPoll;
