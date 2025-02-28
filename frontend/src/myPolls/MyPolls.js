import React, { useState, useEffect } from 'react';
import DeletePoll from '../DeletePolls/DeletePoll'
import '../styles/myPolls.css';

function MyPoll({ poll, refreshPolls, setSelectedPoll }) {
    const [response, setResponse] = useState(null);
    const [copiedText, setCopiedText] = useState(null);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:3001/results/results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pollId: poll.id,
                        questions: poll.Questions
                    }),
                });

                const data = await res.json();
                setVotes(data);
            } catch (error) {
                console.error('Error fetching results in frontend:', error);
            }
        };

        fetchResults();
    }, [poll.id]);

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
              {copiedText === 1 ? 'Kopiert!' : 'Link kopieren'}
            </button>
          </div>
          <div className="resultslink-container">
            <h3 className="link-label">Link zu den <br /> Ergebnissen:</h3>
            <button onClick={() => copyClipboard(0)} className="copy-button">
              {copiedText === 0 ? 'Kopiert!' : 'Link kopieren'}
            </button>
          </div>
          <DeletePoll selectedPoll={poll} refreshPolls={refreshPolls} setSelectedPoll={setSelectedPoll} totalVotes={votes.totalVotes} />
        </div>
    );
}

export default MyPoll;
