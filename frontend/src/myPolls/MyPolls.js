import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import DeletePoll from '../DeletePolls/DeletePoll'
import '../styles/myPolls.css';

function MyPoll({ poll, refreshPolls, setSelectedPoll }) {
    const [copiedText, setCopiedText] = useState(null);
    const [votes, setVotes] = useState({});
    const [showQR, setShowQR] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 410);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 410);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                console.log(data?.totalVotes);
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

    const copyClipboard = async (type) => {
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

            <button onClick={() => setShowQR(!showQR)} className="qr-toggle-button">
                {isMobile ? <FontAwesomeIcon icon={faQrcode} size="lg" /> : (showQR ? "QR-Code ausblenden" : "QR-Code anzeigen")}
            </button>

            {showQR && (
                <div className="qr-codes">
                    <div className="qr-container">
                        <h3>Abstimmung</h3>
                        <QRCodeCanvas value={voteLink} size={128} />
                    </div>
                    <div className="qr-container">
                        <h3>Ergebnisse</h3>
                        <QRCodeCanvas value={resultsLink} size={128} />
                    </div>
                </div>
            )}

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