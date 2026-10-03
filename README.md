# Social Baluni Public School: MERN Website Platform

A dynamic school website with a role-protected admin panel. Staff publish notices, achievements, sports and manage admission enquiries without a developer.

## Tech stack
- **MongoDB** (Mongoose), **Express**, **React** (Vite), **Node.js 18+**
- Auth: JWT with roles (`admin`, `editor`, `teacher`, `parent`, `student`), bcrypt password hashing
- Validation: Zod. Security: Helmet, CORS allow-list, rate limiting

## Database choice
MongoDB fits content that changes shape often (notices, stories, sports pages) and scales with indexes and Atlas. Collections: `users`, `notices`, `achievements`, `sports`, `enquiries`.

## Project structure
```
server/src/index.js    Express app, security middleware, share-link (Open Graph) route
server/src/routes.js   Auth, role checks, CRUD for notices/achievements/sports, enquiries
server/src/models.js   Mongoose schemas and indexes
server/src/seed.js     Creates the admin user and sample data
client/src/App.jsx     Public site and admin panel (#/admin)
docs/                  Design specs, approach, brand assets (banner, crest)
client/public/         crest.svg (logo, favicon), og-banner.png (share preview image)
```

## Major features
- Notices with publish and expiry dates, pinning, category filter (expired items hide automatically)
- Achievements and sports managed through the API, with share links that give rich WhatsApp/Facebook previews
- Admissions enquiry form (validated, rate limited), with a staff-only lead list and status updates
- Staff login and admin panel to add or delete notices
- Three-program homepage: Boarding, Defence Academy, IIT/NEET

## Setup
```bash
# 1. API
cd server && cp .env.example .env     # set MONGO_URI, JWT_SECRET, admin credentials
npm install && npm run seed && npm run dev

# 2. Frontend (new terminal)
cd client && npm install && npm run dev
```
Site: http://localhost:5173. Admin: http://localhost:5173/#/admin (use ADMIN_EMAIL / ADMIN_PASSWORD from `.env`).

## Deployment
1. Database: MongoDB Atlas (create a cluster and copy the connection string).
2. API: Render, Railway or a VPS. Set env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`), start command `npm start`.
3. Frontend: Vercel or Netlify. Set `VITE_API_URL` to the API URL, build command `npm run build`.
4. Use HTTPS only and enable Atlas backups.

## Scalability and security notes
- Stateless API (JWT), so it scales horizontally. Lists are paginated and indexed. Put images on a CDN.
- Inputs are validated on the server, writes need a role, login and enquiries are rate limited.
- SEO: the SPA has meta tags. For full SEO on every story page, add pre-rendering (for example `vite-plugin-ssr`) or migrate the frontend to Next.js, while keeping this API.

## Not yet built (next steps)
Image upload, per-sport detail pages, parent/student portal, Hindi language switch, automated tests.

## Branding
The crest and banner are original placeholder artwork. Replace `client/public/crest.svg` with the school's official logo, and set `og:image` in `client/index.html` to the full URL (for example https://yourdomain.com/og-banner.png) after deployment.
