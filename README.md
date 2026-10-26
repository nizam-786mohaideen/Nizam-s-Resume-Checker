# Nizam's Resume Checker

The repository is split into a React/Vite frontend and an Express API. The API extracts text from uploaded PDFs, sends the resume text and job description to Labd for a match score, and stores the request and result in MongoDB.

Backend code is organized under `backend/`: `routes/` maps API paths, `controller/` handles HTTP requests, `service/` contains comparison logic, `config/` connects MongoDB, `middleware/` handles uploads and errors, `models/` defines MongoDB documents, and `utils.js` holds shared validation helpers.

## Run locally

1. Install dependencies in each app folder:

   ```sh
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. Configure the private `backend/.env` with `PORT`, `MONGODB_URI`, and `LABD_API_KEY`. Keep credentials in that file; do not put them in frontend environment files. `LABD_API_URL` is optional and defaults to `https://agent.thedevlabs.io/v1/api/chat`.

3. Start both servers from the project root:

   ```sh
   npm run dev
   ```

The Vite development server proxies `/api` requests to `http://localhost:4000`. The API health endpoint is `GET /api/health`; comparison requests are submitted as multipart form data to `POST /api/comparisons` using fields `resume` (PDF) and `jobDescription`.

Resume PDFs are stored as MongoDB binary data, with a 10 MB upload limit. The backend extracts at most 50 pages and 40,000 characters of resume text before sending it and the job description to Labd. Scanned image-only PDFs are not supported yet. Job descriptions are limited to 30,000 characters. The API does not expose a read endpoint for stored resumes.
