import React, { useState } from 'react';
import DeletePoll from '../DeletePolls/DeletePoll'
import '../styles/myPolls.css';

function MyPoll({ poll, refreshPolls, setSelectedPoll }) {
    const [response, setResponse] = useState(null);
    const [copiedText, setCopiedText] = useState(null);

    const voteHash = encodeURIComponent(btoa(`public=${poll.public}&mode=vote&poll=${poll.id}&anonymous=${poll.anonymous}`));
    const resultsHash = encodeURIComponent(btoa(`public=${poll.public}&mode=results&poll=${poll.id}&anonymous=${poll.anonymous}`));

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
          <h2 className="pollname">{poll.name}</h2>
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
          <DeletePoll selectedPoll={poll} refreshPolls={refreshPolls} setSelectedPoll={setSelectedPoll} />
        </div>
    );
}

export default MyPoll;
