# Study Resource Organizer

A web application for organizing study materials in one place. Users can upload, browse, and download learning resources, while administrators can manage uploaded resources.

## Features

- User signup and login
- Upload study resources with a title, description, category, and file
- Browse and download available resources
- Admin dashboard for managing resources
- File uploads handled by the Express backend
- MongoDB database for storing application data
- React + Vite frontend for a fast development workflow

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- Multer for file uploads

## Project Structure

```text
study-resource-organizer/
├── backend/
│   ├── uploads/                 # Uploaded files (created as needed; not committed)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── resourceController.js
│   │   ├── middleware/
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── Resource.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── resourceRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env                     # Create locally; do not commit
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/               # Adjust to match your actual files
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                     # Optional, if using Vite environment variables
    └── package.json
```

> The structure above is a guide. Update the frontend paths to match your current Vite project.

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- MongoDB locally, or a MongoDB Atlas connection string
- Git (optional, for version control)

## Getting Started

### 1. Clone the repository

```bash
git clone     https://github.com/stillnight88/study-resource-organizer.git
   cd STUDY-RESOURCE-ORGANIZER
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/studyorganizer
NODE_ENV=development
```

Use your own secure values. Ensure MongoDB is running, or replace `MONGODB_URI` with your MongoDB Atlas connection string.

Start the backend using the script defined in `backend/package.json`. For example, if a `dev` script is configured:

```bash
npm run dev
```

Otherwise, use the start script configured in your package file, such as:

```bash
npm start
```

The API is expected to run at `http://localhost:5000`.

Health check:

```text
GET http://localhost:5000/api/health
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL, commonly `http://localhost:5173`.

If your frontend uses a hard-coded API URL, make sure it points to:

```text
http://localhost:5000
```

For a Vite environment variable, create `frontend/.env` and use a variable such as:

```env
VITE_API_URL=http://localhost:5000/api
```

Your frontend code must read this variable with `import.meta.env.VITE_API_URL` for it to take effect.

## API Endpoints

The backend routes are intended to expose the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check whether the API is running |
| POST | `/api/users/signup` | Register a user |
| POST | `/api/users/login` | Log in a user |
| GET | `/api/resources` | Retrieve resources |
| POST | `/api/resources` | Upload a resource (multipart form data; file field: `file`) |
| DELETE | `/api/resources/:id` | Delete a resource |

The actual authorization requirements depend on your route and controller implementation.

## File Uploads

- Uploaded files are stored in `backend/uploads/`.
- Files are served from the `/uploads/` URL path.
- A resource download URL should use the backend origin plus the saved `filePath`, for example:

```text
http://localhost:5000/uploads/<filename>
```

- The current Multer configuration limits uploads to 10 MB.
- The `uploads/` directory and its contents should not be committed to Git. Back up important uploads separately if needed.

## Security Notes

Before deploying publicly:

- Hash user passwords with a password-hashing library such as `bcrypt`.
- Use properly signed and verified authentication tokens or secure sessions.
- Enforce authentication and admin authorization on protected endpoints.
- Validate uploaded file types and sanitize filenames.
- Keep `.env` and credentials out of source control.
- Configure CORS for the deployed frontend origin.
- Use HTTPS in production.
- Apply request validation, rate limiting, and appropriate error handling.

## Common Issues

**MongoDB connection fails**
- Confirm MongoDB is running.
- Check `MONGODB_URI` in `backend/.env`.

**Port 5000 is already in use**
- Stop the other process or change `PORT` in `backend/.env`.

**Uploaded file returns 404**
- Confirm the file exists in `backend/uploads/`.
- Confirm Express serves that folder at `/uploads`.
- Ensure the saved resource `filePath` starts with `/uploads/`, not `/api/uploads/`.
- Open the file URL using the backend origin, for example `http://localhost:5000/uploads/<filename>`.

**Frontend cannot reach the API**
- Confirm the backend is running.
- Check the API base URL and CORS configuration.
- Check the browser console and backend terminal for errors.

## Contributing

1. Create a branch for your change.
2. Make and test your updates.
3. Commit your changes with a descriptive message.
4. Push the branch and open a pull request.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute this project under an open-source license.
