import React, { useState, useEffect } from 'react';

function Login() {
    const [users, setUsers] = useState([]);

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
    return (
        <div className="WriteUsers">
        <ul>
        {users.map((msg) => (
            <li key={msg.id}>name: {msg.name} password: {msg.password}</li>
        ))}
        </ul>
        </div>
    )
}

export default Login;
