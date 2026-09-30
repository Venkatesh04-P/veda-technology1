# VEDA TECHNOLOGY Backend

Node.js + Express backend for the VEDA TECHNOLOGY website.

## API
- GET / - backend status
- GET /api/health - health check
- POST /api/contact - save contact form message
- POST /api/login - admin login
- GET /api/check-login - check admin session
- POST /api/logout - logout
- GET /api/messages - get messages (admin only)
- DELETE /api/messages/:id - delete message (admin only)

## Local setup
1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Run `npm start`.
4. Backend runs on http://localhost:5000.

## Production note
`messages.json` is for local testing. For production cloud deployment, use a persistent database because cloud/serverless local files are not reliable durable storage.
