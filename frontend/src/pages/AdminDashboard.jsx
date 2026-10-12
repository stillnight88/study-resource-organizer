import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;
const CATEGORIES = ['All', 'Notes', 'Assignments', 'Books', 'Practice'];

function AdminDashboard() {
    const navigate = useNavigate();
    const [allResources, setAllResources] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('All');
    const [loadFailed, setLoadFailed] = useState(false);

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        user = null;
    }

    async function loadResources() {
        try {
            const response = await fetch(`${API_URL}/resources`);
            const data = await response.json();
            setAllResources(data);
            setLoadFailed(false);
        } catch (error) {
            console.log('Error:', error);
            setLoadFailed(true);
        }
    }

    useEffect(() => {
        loadResources();
    }, []);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    async function deleteResource(resourceId) {
        const confirmDelete = confirm('Are you sure you want to delete this resource?');

        if (confirmDelete) {
            try {
                const response = await fetch(`${API_URL}/resources/${resourceId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail: user.email })
                });

                if (response.ok) {
                    alert('Resource deleted successfully!');
                    loadResources();
                } else {
                    alert('Failed to delete resource');
                }
            } catch (error) {
                console.log('Error:', error);
                alert('Error deleting resource');
            }
        }
    }

    function logout() {
        localStorage.removeItem('user');
        navigate('/login');
    }

    const resourcesToShow =
        currentFilter === 'All'
            ? allResources
            : allResources.filter((r) => r.category === currentFilter);

    let listContent;
    if (loadFailed) {
        listContent = <p className="no-resources">Failed to load resources</p>;
    } else if (resourcesToShow.length === 0) {
        listContent = <p className="no-resources">No resources found</p>;
    } else {
        listContent = resourcesToShow.map((resource) => (
            <div className="resource-card" key={resource._id}>
                <h3>{resource.title}</h3>
                <span className="category-badge">{resource.category}</span>
                <p>{resource.description}</p>
                <div className="card-buttons">
                    <a href={`${BASE_URL}${resource.filePath}`} target="_blank" rel="noreferrer">
                        Download
                    </a>
                    <button onClick={() => deleteResource(resource._id)}>Delete</button>
                </div>
            </div>
        ));
    }

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <h1>Admin Dashboard</h1>
                    <p className="user-name">Welcome, <span>{user.name}</span></p>
                </div>
                <div className="header-right">
                    <button onClick={() => navigate('/add-resource')} className="btn-add">
                        + Add New Resource
                    </button>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </div>

            <div className="main-container">
                <div className="filter-section">
                    <h2>Filter by Category</h2>
                    <div className="category-filter">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                className={`filter-btn ${currentFilter === c ? 'active' : ''}`}
                                onClick={() => setCurrentFilter(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="resources-section">
                    <h2>All Resources</h2>
                    <div id="resourcesList">{listContent}</div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;