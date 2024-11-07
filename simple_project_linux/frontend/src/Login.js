import React, { useState, useEffect } from 'react';

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

    const checkLogin = (e) => {
        if (users.includes(inputUser)){
            if (users.indexOf(inputUser) === users.indexOf(inputPassword)){
                const loginMode = true;
                loginChange(loginMode);
            }
        }
        else (console.log('Wrong username or Password'));
    }

    return (
        <div>
        <form onSubmit={checkLogin}>
        <label>
        Name:
        <input
        type="text"
        value={inputUser}
        onChange={(e) => setInputUser(e.target.value)}
        />
        </label>
        <label>
        Password:
        <input
        type="text"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        />
        </label>
        <button type="submit">Login</button>
        </form>
        </div>
    )
}

export default Login;
