
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.error) {
                setError(`Login failed: ${data.error}`);
                toast.error(`Login failed: ${data.error}`);
            } else {
                console.log('Login Successful');
                const token = data.token;
                localStorage.setItem('authToken', token);
                // console.log(localStorage.getItem('authToken'))
                // console.log("**********************************")
                toast.success('Login Successful!');
                navigate('/stats');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
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

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <span>Don't have an account?</span>
                    <button className="btn btn-link" onClick={() => navigate('/register')}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
