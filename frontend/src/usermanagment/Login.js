import React, { useState, useEffect } from 'react';
import '../styles/register.css';

const Login = ({ loginChange }) => {
    const [users, setUsers] = useState([]);
    const [inputUser, setInputUser] = useState('');
    const [inputPassword, setInputPassword] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/users');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const checkLogin = (event) => {
        event.preventDefault();
        const user = users.find(u => u.name === inputUser && u.password === inputPassword);
        if (user) {
            const loginMode = true;
            loginChange(loginMode, user.id, user.name);
        } else {
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
