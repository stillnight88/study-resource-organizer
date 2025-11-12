const API_URL = 'http://localhost:5000';

const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'admin') {
    window.location.href = 'login.html';
}

document.getElementById('userName').textContent = user.name;
document.getElementById('userEmail').textContent = user.email;
document.getElementById('userRole').textContent = user.role;

loadResources();

const addResourceForm = document.getElementById('addResourceForm');
addResourceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const fileInput = document.getElementById('file');
    const message = document.getElementById('addMessage');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', fileInput.files[0]);
    formData.append('userEmail', user.email);

    try {
        const response = await fetch(`${API_URL}/resources`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = 'Resource added!';
            message.className = 'message success';
            addResourceForm.reset();
            loadResources();
        } else {
            message.textContent = data.message;
            message.className = 'message error';
        }
    } catch (error) {
        message.textContent = 'Server error';
        message.className = 'message error';
    }
});

async function loadResources() {
    try {
        const response = await fetch(`${API_URL}/resources`);
        const resources = await response.json();

        const container = document.getElementById('resourcesList');
        container.innerHTML = '';

        if (resources.length === 0) {
            container.innerHTML = '<p>No resources available</p>';
            return;
        }

        resources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <h3>${resource.title}</h3>
                <p><strong>Category:</strong> ${resource.category}</p>
                <p>${resource.description}</p>
                <a href="${API_URL}${resource.filePath}" target="_blank">Download File</a>
                <button onclick="deleteResource('${resource._id}')">Delete</button>
                <hr>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log('Error loading resources');
    }
}

async function deleteResource(id) {
    if (confirm('Delete this resource?')) {
        try {
            const response = await fetch(`${API_URL}/resources/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email })
            });

            if (response.ok) {
                loadResources();
            }
        } catch (error) {
            alert('Server error');
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}