import React, { useState, useEffect } from 'react';
import '../styles/register.css';

const NewUser = ({ token }) => {
    const [username, setUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [validationPassword, setValidationPassword] = useState('');
    const [users, setUsers] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [response, setResponse] = useState(null);

    const createUser = async (event) => {
        event.preventDefault();
        try {
            if (inputPassword && username && inputPassword === validationPassword) {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                        name: username,
                        password: inputPassword
                    }),
                });
                const data = await res.json();
                setUsers(data);

                if (res.ok) {
                    setErrorMessage(null);
                    setResponse("Registrieung erfolgreich abgeschlossen!");
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 5000);
                } else {
                    setResponse(null);
                    setErrorMessage(data.error || "Fehler beim Anlegen des Users!");
                }
            } else {
                setResponse(null);
                if (!username || !inputPassword || !validationPassword) {
                    setErrorMessage("Alle Felder müssen ausgefüllt werden!");
                } else {
                    setErrorMessage("Passwörter stimmen nicht überein!");
                }
            }
        } catch (error) {
            setResponse(null);
            setErrorMessage("Fehler beim Anlegen des Users!");
        }
    }

    return (
        <div className="new-user">
            <form onSubmit={createUser}
            className='registerForm'>
                <h2>Registrierung abschließen</h2>
                    <h4>Username</h4>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <h4>Passwort</h4>
                    <input
                        type="password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                    />
                    <h4>Passwort erneut eingeben</h4>
                    <input
                        type="password"
                        value={validationPassword}
                        onChange={(e) => setValidationPassword(e.target.value)}
                    />
                <button type="submit">Abschicken</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {response && <p className="response">{response}</p>}
            </form>
        </div>
    );
}

export default NewUser;
