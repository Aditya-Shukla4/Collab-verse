# Collab Verse

**Find developers. Build together. Ship faster.**

Collab Verse is a full-stack platform for developer team formation — skill-based matchmaking, real-time collaboration, and an integrated code execution environment, all in one place.

🔗 **[Live Demo](https://collab-verse.vercel.app)**

---

## The Problem

Finding the right collaborator for a project or hackathon is painful. Discord servers, Reddit posts, cold DMs — none of it works well. Collab Verse fixes this by matching developers based on verified skills, project needs, and availability.

---

## Features

- **Skill-based matchmaking** — find developers by tech stack, domain, and collaboration status
- **GitHub-verified profiles** — real contribution history, no fake credentials
- **Project listings** — post your project, specify roles needed, accept/reject join requests
- **Real-time collaborative editor** — Monaco editor with live sync via Socket.io
- **Integrated terminal** — run Python, JavaScript, C++, Java, Go, Rust directly in the browser
- **Project chat** — persistent messaging per project room
- **Collab requests** — send/accept/reject colleague requests

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Real-time | Socket.io |
| Editor | Monaco Editor |
| Terminal | node-pty, xterm.js |
| Auth | GitHub OAuth, Google OAuth, JWT |
| Compiler | Custom Node.js microservice |

---

## Project Structure

```
Collab-verse/
├── client/              # Next.js frontend
│   └── src/
│       ├── pages/       # Route pages
│       ├── components/  # UI components
│       ├── context/     # Auth, Socket context
│       └── store/       # Zustand stores
├── server/              # Express.js API
│   ├── routes/
│   ├── models/
│   └── middleware/
└── compiler-service/    # Code execution microservice
    ├── index.js         # Socket.io + HTTP server
    ├── terminalService.js
    └── executionService.js
```

---

## Running Locally

**Prerequisites:** Node.js 18+, MongoDB

### 1. Clone

```bash
git clone https://github.com/Aditya-Shukla4/Collab-verse.git
cd Collab-verse
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_COMPILER_API_URL=http://localhost:6001
```

```bash
npm run dev
```

### 4. Compiler Service

```bash
cd compiler-service
npm install
node index.js
```

> **Windows note:** Requires `python`, `node`, and any other language runtimes in your PATH for code execution.

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | JWT signing secret |
| `GITHUB_CLIENT_ID/SECRET` | server | GitHub OAuth app credentials |
| `GOOGLE_CLIENT_ID/SECRET` | server | Google OAuth credentials |
| `NEXT_PUBLIC_API_URL` | client | Backend API base URL |
| `NEXT_PUBLIC_COMPILER_API_URL` | client | Compiler service URL |

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built by [Aditya Shukla](https://github.com/Aditya-Shukla4)
