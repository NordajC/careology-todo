# Checked ✅

A simple but full-featured todo app built as a take-home task for Careology.

🌐 **Live:** http://51.20.193.244

---

## What it does

- Register and log in with email and password
- Add, edit, delete and reorder tasks via drag and drop
- Mark tasks as done
- Set due dates, priority tags and notes per task
- Automatically shows current weather for tasks that mention a city (e.g. "Trip to Tokyo")
- Search across your tasks
- Works on mobile and desktop
- Password reset via email

## Tech

**Frontend** — React + TypeScript (Vite), Chakra UI, Apollo Client, Firebase Auth, @dnd-kit

**Backend** — Node.js, Apollo Server, GraphQL, MongoDB + Mongoose, Firebase Admin

**Infra** — Docker, AWS EC2, MongoDB Atlas

---

## Running locally

You'll need Node 20+, and the `.env` files which are sent separately.

```bash
git clone https://github.com/yourusername/careology-todo.git
cd careology-todo
```

**Backend**
```bash
cd backend
npm install
npm run dev
# runs at http://localhost:4000/graphql
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# runs at http://localhost:5173
```

## Running with Docker

```bash
docker compose up --build
# frontend → http://localhost
# backend  → http://localhost:4000/graphql
```

---

## Environment variables

### `backend/.env`
```
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
OPENWEATHER_API_KEY=
```

### `frontend/.env`
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GRAPHQL_URI=http://localhost:4000/graphql
```

> All `.env` files and the Firebase service account JSON are excluded from the repo via `.gitignore` and will be sent separately.

---

## Deploying to EC2

1. Launch an Ubuntu 24.04 EC2 instance (t3.micro), open ports 22, 80 and 4000
2. SSH in and install Docker:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```
3. Clone the repo, create both `.env` files, set `VITE_GRAPHQL_URI=http://YOUR_EC2_IP:4000/graphql`
4. Run:
```bash
docker compose up --build -d
```

---

## Notes

- The weather.com API key in the task brief was inactive — OpenWeatherMap free tier was used as a working alternative
- AWS EC2 + Docker is the AWS service used for this task
- `.env` files and Firebase service account JSON will be sent separately