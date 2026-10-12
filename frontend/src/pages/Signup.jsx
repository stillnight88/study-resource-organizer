import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';

const API_URL = 'http://localhost:5000/api/users';

function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
}

function isValidPassword(password) {
    return password.length >= 6;
}

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        document.body.className = 'auth-page';
        return () => {
            document.body.className = '';
        };
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage({ text: 'Please enter a valid email', type: 'error' });
            return;
        }

        if (!isValidPassword(password)) {
            setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'Account created! Redirecting...', type: 'success' });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setMessage({ text: data.message, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Server error', type: 'error' });
        }
    }

    return (
        <div className="container">
            <div className="form-box signup">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="signupName">Full Name</label>
                        <input
                            type="text"
                            id="signupName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="signupEmail">Email</label>
                        <input
                            type="email"
                            id="signupEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="signupPassword">Password</label>
                        <input
                            type="password"
                            id="signupPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className={`message ${message.type}`}>{message.text}</p>
                    <button type="submit" className="btn">Sign Up</button>
                    <p className="switch">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;