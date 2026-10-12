import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';

const API_URL = 'http://localhost:5000/api/users';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        document.body.className = 'auth-page login-page';
        return () => {
            document.body.className = '';
        };
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    text: 'Login successful!',
                    type: 'success',
                });

                localStorage.setItem('user', JSON.stringify(data.user));

                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/user-dashboard');
                    }
                }, 1000);
            } else {
                setMessage({
                    text: data.message || 'Login failed',
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Login error:', error);

            setMessage({
                text: 'Cannot connect to server. Check your backend.',
                type: 'error',
            });
        }
    }


    return (
        <div className="container">
            <div className="welcome-box">
                <h1>
                    Welcome to<br />
                    <span>Study Resource Organizer</span>
                </h1>
                <p>Sign in to continue access</p>
            </div>

            <div className="form-box login">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="loginEmail">Email</label>
                        <input
                            type="email"
                            id="loginEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="loginPassword">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className={`message ${message.type}`}>{message.text}</p>
                    <button type="submit" className="btn">Login</button>
                    <p className="switch">
                        Don’t have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;