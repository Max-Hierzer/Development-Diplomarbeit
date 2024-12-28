import React, { useState, useEffect } from 'react';
import '../styles/register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [response, setResponse] = useState(null); // To show success/error message

    useEffect(() => {
        const fetchRoles = async () => {
          try {
            const res = await fetch('http://localhost:3001/api/roles'); // Replace with your roles endpoint
            const data = await res.json();
            setRoles(data);
          } catch (error) {
            console.error('Error fetching roles:', error);
          }
        };
    
        fetchRoles();
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh on form submit

        try {
            const res = await fetch('http://localhost:3001/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, roleId }) // Send user data to backend
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(`User created with ID: ${data.id}`); // Success message
            } else {
                setResponse(`Error: ${data.error}`); // Error message
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setResponse('Error submitting user data');
        }

    };

    return (
        <div className="Register">
            <h1>Create a New User</h1>
            <form onSubmit={handleSubmit} className='registerForm'>
                <input
                    type="text"
                    placeholder={`Name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                <input
                    type="email"
                    placeholder={`example@mail.at`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <input
                    type="password"
                    placeholder={`Password`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                    <option value="">Select a Role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Register</button>
            </form>

            {response && <p>{response}</p>} {/* Show success/error message */}
        </div>
    );
}

export default Register;
