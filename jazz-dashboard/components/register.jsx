import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration Successful');
                toast.success('Registration Successful!');

                navigate('/login');
            } else {
                setError(data.message || 'Registration failed.');
                toast.error(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    {/* Email input field */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password input field */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Submit button for registration */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <span>Already have an account?</span>
                    <button className="btn btn-link" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
