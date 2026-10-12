import { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const API_URL = 'http://localhost:5000/api';

function AddResource() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        user = null;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    function showMessage(text, type) {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 5000);
    }

    function logout() {
        localStorage.removeItem('user');
        navigate('/login');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const file = fileRef.current.files[0];

        if (!file) {
            showMessage('Please select a file', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('file', file);
        formData.append('userEmail', user.email);

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/resources`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Resource added successfully!', 'success');
                setTitle('');
                setDescription('');
                setCategory('');
                fileRef.current.value = '';

                setTimeout(() => {
                    navigate('/admin-dashboard');
                }, 1500);
            } else {
                showMessage(data.message || 'Failed to add resource', 'error');
                setSubmitting(false);
            }
        } catch (error) {
            console.log('Error:', error);
            showMessage('Server error. Please try again.', 'error');
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <h1>Add New Resource</h1>
                </div>
                <div className="header-right">
                    <button onClick={() => navigate('/admin-dashboard')} className="btn-back">
                        ← Back to Dashboard
                    </button>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Resource Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">-- Select Category --</option>
                            <option value="Notes">Notes</option>
                            <option value="Assignments">Assignments</option>
                            <option value="Books">Books</option>
                            <option value="Practice">Practice</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">Upload File</label>
                        <input type="file" id="file" ref={fileRef} required />
                    </div>

                    <div className={message.text ? `message show ${message.type}` : 'message'}>
                        {message.text}
                    </div>

                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Resource'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddResource;