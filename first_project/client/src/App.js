import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error:', error));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hallo ich bin ehemaliger Fußballprofi &nbsp;
        <a
          className="App-link"
          href="https://www.oefb.at/Profile/Spieler/881926?Tobias-Prasser"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tobias Prasser
        </a>
        </p>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
