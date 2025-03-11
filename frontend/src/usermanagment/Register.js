import React, { useState, useEffect } from 'react';
import '../styles/register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRoleDescription, setSelectedRoleDescription] = useState('');
    const [oldRegister, setOldRegister] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/roles');
                const data = await res.json();
                setRoles(data);
                setRoleId(data.at(-1)?.id);
                setSelectedRoleDescription(data.at(-1).description);
            } catch (error) {
                setErrorMessage("Fehler beim laden der Rollen");
            }
        };
        fetchRoles();
    }, []);

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
                setErrorMessage(null);
                setResponse(`User angelegt und Email gesendet!`);
            } else {
                setResponse(null);
                setErrorMessage(`${data.message}`);
            }
        } catch (error) {
            setResponse(null);
            setErrorMessage('Fehler beim Anlegen des Users!');
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
            <h1>Registrieren</h1>
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
                <br />
                <button type="submit">Register</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {response && <p className="response">{response}</p>}
            </form>
        </div>
    );
}

export default Register;
