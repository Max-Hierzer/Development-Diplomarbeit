import React, { useState, useEffect } from 'react';
import '../styles/register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [response, setResponse] = useState(null);
    const [selectedRoleDescription, setSelectedRoleDescription] = useState('');
    const [oldRegister, setOldRegister] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/roles');
                const data = await res.json();
                setRoles(data);
                setRoleId(data.at(-1)?.id);
                setSelectedRoleDescription(data.at(-1).description);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    const handleOldSubmit = async (event) => {
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page refresh on form submit

        try {
            const res = await fetch('http://localhost:3001/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, roleId }) // Send user data to backend
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(`Email sent!`);
            } else {
                setResponse(`Error: ${data.error}`); // Error message
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setResponse('Error submitting user data');
        }
    };

    const handleRoleChange = (event) => {
        setRoleId(event.target.value);

        const selectedRole = roles.find(role => role.id === parseInt(event.target.value, 10));
        if (selectedRole) {
            setSelectedRoleDescription(selectedRole.description);
        } else {
            setSelectedRoleDescription('');
        }
    };

    return (
        <div className="Register">
            <button onClick={() => setOldRegister(!oldRegister)}>{oldRegister ? "Switch to New Register" : "Switch to Old Register"}</button>
            {!oldRegister ? (
            <div>
                <h1>New Register</h1>
                <form onSubmit={handleSubmit} className='registerForm'>
                    <input
                        type="text"
                        placeholder={`Vorname`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder={`Nachname`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        id="email"
                        placeholder={`example@mail.at`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="role-select">
                        <br />
                        <h4>Rolle</h4>
                        <select
                            id="role"
                            className="RoleSelect"
                            value={roleId}
                            onChange={handleRoleChange}
                            required>
                            {roles.slice().reverse().map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="role-description">
                        <p>Beschreibung:</p>
                        {selectedRoleDescription}
                    </div>
                    <button type="submit">Register</button>
                </form>
                {response && <p>{response}</p>}
            </div>
            ) : (
            <div>
            <h1>Create a New User</h1>
            <form onSubmit={handleOldSubmit} className='registerForm'>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder={`Name`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder={`example@mail.at`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder={`Password`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        className="RoleSelect"
                        value={roleId}
                        onChange={handleRoleChange}
                        required>
                        <option value="">Select a Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="roleDescription">
                    <div className="vortitel">Description of role</div>
                    {selectedRoleDescription}
                </div>

                <button type="submit">Register</button>
            </form>

            {response && <p>{response}</p>}
            </div>
        )}
        </div>
    );
}

export default Register;
