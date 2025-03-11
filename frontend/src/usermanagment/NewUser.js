import React, { useState, useEffect } from 'react';
import '../styles/register.css';

const NewUser = ({ token }) => {
    const [username, setUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPassword2, setInputPassword2] = useState('');
    const [users, setUsers] = useState('');
    const [response, setResponse] = useState(null);

    const createUser = async (event) => {
        event.preventDefault();
        try {
            if (inputPassword === inputPassword2) {
                const res = await fetch('http://localhost:3001/api/user', {
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
                    setResponse("Registrieung erfolgreich abgeschlossen!");
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                } else {
                    setResponse(data.message || "Fehler beim Anlegen des Users!");
                }
            } else {
                setResponse("Die Passwörter stimmen nicht überein!");
            }
        } catch (error) {
            (console.log('Wrong username or Password'));
        }
    }

    return (
        <div>
            <form onSubmit={createUser} className='registerForm'>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Passwort</label>
                    <input
                        type="password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                    />
                    <label>Passwort erneut eingeben</label>
                    <input
                        type="password"
                        value={inputPassword2}
                        onChange={(e) => setInputPassword2(e.target.value)}
                    />
                <button type="submit">Registrierung abschließen</button>
            </form>

            {response && <p className="response">{response}</p>}
        </div>
    );
}

export default NewUser;
