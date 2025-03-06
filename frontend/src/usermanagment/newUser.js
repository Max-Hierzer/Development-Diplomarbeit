import React, { useState, useEffect } from 'react';
import '../styles/register.css';

const newUser = ({ link }) => {
    const [inputPassword, setInputPassword] = useState('');
    const [inputPassword2, setInputPassword2] = useState('');
    const [users, setUsers] = usestate('');
    const [errorMessage, setErrorMessage] = useState('');

    const createUser = async (event) => {
        event.preventDefault();
        try {
            if (inputPassword === inputPassword2) {
                const res = await fetch('http://localhost:3001/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        link: link,
                        password: inputPassword
                    }),
                });
                const data = await res.json();
                setUsers(data);

                if (res.ok && data.success) {
                    return;
                } else {
                    setErrorMessage(data.message || "Fehler beim Anlegen des Users!");
                }
            } else {
                setErrorMessage("Die Passwörter stimmen nicht überein!");
            }
        } catch (error) {
            (console.log('Wrong username or Password'));
        }
    }

    return (
        <div>
            <form onSubmit={createUser} className='registerForm'>
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
                <button type="submit">Anmelden</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default newUser;
