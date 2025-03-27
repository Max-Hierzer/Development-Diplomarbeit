import React, { useState, useEffect } from 'react';
import '../styles/register.css';

const Login = ({ loginChange }) => {
    const [users, setUsers] = useState([]);
    const [inputUser, setInputUser] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const checkLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: inputUser,
                    password: inputPassword
                }),
            });
            const data = await res.json();
            setUsers(data);

            if (res.ok && data.success) {
                loginChange(true, data.userId, data.username, data.roleId);
            } else {
                setErrorMessage(data.message || "Invalid username or password");
            }
        } catch (error) {
            (console.log('Wrong username or Password'));
        }
    }

    return (
        <div>
            <form onSubmit={checkLogin} className='registerForm'>
                    <input
                        type="text"
                        placeholder={`Name`}
                        value={inputUser}
                        onChange={(e) => setInputUser(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder={`Password`}
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                    />
                <button type="submit">Anmelden</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default Login;
