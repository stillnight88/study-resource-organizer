const API_URL = 'http://localhost:5000';

const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}

document.getElementById('userName').textContent = user.name;
document.getElementById('userEmail').textContent = user.email;
document.getElementById('userRole').textContent = user.role;

loadResources();

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
            card.innerHTML = `
                <h3>${resource.title}</h3>
                <p><strong>Category:</strong> ${resource.category}</p>
                <p>${resource.description}</p>
                <a href="${API_URL}${resource.filePath}" target="_blank">Download File</a>
                <hr>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log('Error loading resources');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}