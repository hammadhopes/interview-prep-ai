# Interview Prep AI

Paste a job description, add your resume, and get a tailored interview prep plan: match score, likely questions with answer tips, skill gaps, and a day-by-day study plan. It can also generate a one-page resume tailored to the role as a PDF.

**Live demo:** _https://interview-prep-ai-production-0414.up.railway.app/_

## Features

- Sign up and log in (JWT in an httpOnly cookie)
- Upload a PDF resume or write a short self-description
- AI-generated report, saved to your account
- Tailored, ATS-friendly resume export to PDF

## Tech stack

- **Frontend:** React, Vite, React Router, SCSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI and PDF:** Google Gemini, pdf-parse, Puppeteer

## Run locally

You'll need Node.js 22+, a MongoDB connection string and a Gemini API key.

```bash
git clone <your-repo-url>
cd <repo-folder>
```

Create `Backend/.env`:

```env
MONGO_URI=
JWT_SECRET=
GOOGLE_GENAI_API_KEY=
```

Then start both servers in separate terminals:

```bash
cd Backend && npm install && npm run dev    # http://localhost:3000
cd Frontend && npm install && npm run dev   # http://localhost:5173
```

Vite proxies `/api` to the backend in development, so there's nothing else to configure.

## Deployment

Express serves the built React app, so everything runs as a single service.

```bash
npm run build   # installs dependencies and builds the frontend
npm start       # starts the server
```

Set `MONGO_URI`, `JWT_SECRET`, `GOOGLE_GENAI_API_KEY` and `NODE_ENV=production` as environment variables. Deployed on Railway with MongoDB Atlas.

## Notes

- Scanned PDFs without selectable text can't be parsed. Use the self-description field instead.
- PDF generation runs headless Chrome, so it needs a reasonable amount of memory.
