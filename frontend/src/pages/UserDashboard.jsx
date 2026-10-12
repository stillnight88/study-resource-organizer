import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const API_URL = 'http://localhost:5000/api';
const CATEGORIES = [
    { value: 'All', label: 'All' },
    { value: 'Notes', label: '📘 Notes' },
    { value: 'Assignments', label: '📄 Assignments' },
    { value: 'Books', label: '📚 Books' },
    { value: 'Practice', label: '🧠 Practice' }
];

function getCategoryIcon(category) {
    if (category === 'Notes') return '📘';
    if (category === 'Videos') return '🎥';
    if (category === 'Assignments') return '📄';
    if (category === 'Books') return '📚';
    if (category === 'Practice') return '🧠';
    return '';
}

function UserDashboard() {
    const navigate = useNavigate();
    const [allResources, setAllResources] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('All');

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        user = null;
    }

    useEffect(() => {
        async function loadResources() {
            try {
                const response = await fetch(`${API_URL}/resources`);
                const resources = await response.json();
                setAllResources(resources);
            } catch (error) {
                console.log('Error loading resources');
            }
        }
        loadResources();
    }, []);

    if (!user) {
        return <Navigate to="/login" />;
    }

    function logout() {
        localStorage.removeItem('user');
        navigate('/login');
    }

    const filteredResources =
        currentFilter === 'All'
            ? allResources
            : allResources.filter((r) => r.category === currentFilter);

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <h1>Student Dashboard 📚</h1>
                    <p className="user-name">Welcome, <span>{user.name}</span></p>
                </div>
                <div className="header-right">
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </div>

            <div className="main-container">
                <div className="filter-section">
                    <h2>Filter by Category</h2>
                    <div className="category-filter">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.value}
                                className={`filter-btn ${currentFilter === c.value ? 'active' : ''}`}
                                onClick={() => setCurrentFilter(c.value)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="resources-section">
                    <h2>Study Resources</h2>
                    <div id="resourcesList">
                        {filteredResources.length === 0 ? (
                            <p className="no-resources">No resources available in this category.</p>
                        ) : (
                            filteredResources.map((resource) => (
                                <div className="resource-card" key={resource._id}>
                                    <h3>{getCategoryIcon(resource.category)} {resource.title}</h3>
                                    <p className="category-tag">{resource.category}</p>
                                    <p>{resource.description}</p>
                                    <div className="card-actions">

                                        <a href={`http://localhost:5000${resource.filePath.replace(/^\/api/, "")}`} target="_blank" rel="noreferrer">
                                            Download
                                        </a>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserDashboard;