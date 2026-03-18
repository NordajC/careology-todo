# Checked 

**Live Demo:** http://51.20.193.244

A full-stack todo application built with React, TypeScript, Node.js, GraphQL, and MongoDB.

## Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- Chakra UI v3
- Apollo Client
- Firebase Auth (client SDK)
- @dnd-kit (drag and drop)
- React Router v6

**Backend**
- Node.js + Apollo Server (standalone)
- GraphQL
- MongoDB + Mongoose
- Firebase Admin SDK (token verification)

**Infrastructure**
- Docker + Docker Compose
- AWS EC2 (deployment)
- MongoDB Atlas (database)
- Firebase (authentication)

---

## Features

- Register and login with email and password
- Password reset via email
- Remember me (persistent session)
- Add, edit, delete tasks
- Mark tasks as done / undone
- Drag and drop to reorder tasks
- Weather display for tasks containing a city name
- Due date, tag (Low / Medium / High) and note per task
- Search tasks
- Responsive design (mobile and desktop)

---

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- MongoDB Atlas account (free tier)
- Firebase project with Email/Password auth enabled
- OpenWeatherMap API key (free tier)

---

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
FIREBASE_SERVICE_ACCOUNT_PATH=./careology-todo-firebase-adminsdk-fbsvc-8f1fcf6e19.json
OPENWEATHER_API_KEY=your_openweathermap_api_key
```

> The Firebase service account JSON file must be placed in the `backend/` directory. It is listed in `.gitignore` and must never be committed to the repository. Send it separately.

### Frontend (`frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Vite environment variables are injected at **build time**. Set these before running `docker compose build`.

---

## Running Locally (without Docker)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/careology-todo.git
cd careology-todo
```

### 2. Set up environment variables

Copy the `.env` examples above into:
- `backend/.env`
- `frontend/.env`

Place your Firebase service account JSON in `backend/`.

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run the backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:4000/graphql`

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Running with Docker

### 1. Set up environment variables

Follow the environment variables section above. Make sure both `.env` files exist and the Firebase JSON is in `backend/`.

### 2. Build and run

```bash
docker compose up --build
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:4000/graphql`

### 3. Stop

```bash
docker compose down
```

---

## Deploying to AWS EC2

### 1. Launch an EC2 instance

- Go to AWS Console → EC2 → Launch Instance
- Choose **Ubuntu 24.04 LTS**
- Instance type: **t2.micro** (free tier eligible)
- Create or select a key pair (download the `.pem` file)
- Security group — open these ports:
  - 22 (SSH)
  - 80 (HTTP)
  - 4000 (GraphQL API)

### 2. Connect to EC2

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. Install Docker on EC2

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
# Log out and back in for group changes to take effect
exit
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 4. Clone the repository

```bash
git clone https://github.com/yourusername/careology-todo.git
cd careology-todo
```

### 5. Set up environment variables on EC2

```bash
# Backend .env
nano backend/.env
# Paste your backend environment variables

# Frontend .env
nano frontend/.env
# Paste your frontend environment variables

# Firebase service account JSON
nano backend/careology-todo-firebase-adminsdk-fbsvc-8f1fcf6e19.json
# Paste the contents of your service account JSON file
```

### 6. Update the frontend API URL

In `frontend/.env` make sure the GraphQL URI points to your EC2 public IP:

```env
VITE_GRAPHQL_URI=http://your-ec2-public-ip:4000/graphql
```

Also update `frontend/src/apollo/client.ts` to use this env variable:

```typescript
const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000/graphql"
})
```

### 7. Build and run

```bash
docker compose up --build -d
```

The `-d` flag runs containers in the background.

### 8. Verify

```bash
docker compose ps        # check containers are running
docker compose logs -f   # follow logs
```

Visit `http://your-ec2-public-ip` in your browser.

---

## Project Structure

```
careology-todo/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Task.ts           # Mongoose schema
│   │   ├── resolvers.ts          # GraphQL resolvers
│   │   ├── schema/
│   │   │   └── index.ts          # GraphQL type definitions
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── weather.ts        # City detection + weather API
│   │   ├── db.ts                 # MongoDB connection
│   │   ├── firebase.ts           # Firebase Admin SDK
│   │   └── index.ts              # Apollo Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env                      # Not committed
│
├── frontend/
│   ├── src/
│   │   ├── apollo/
│   │   │   └── client.ts         # Apollo Client setup
│   │   ├── components/
│   │   │   ├── TaskTable/        # Desktop + mobile task components
│   │   │   ├── AuthLayout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Firebase auth context
│   │   ├── graphql/
│   │   │   └── tasks.ts          # GraphQL queries + mutations
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── services/
│   │   │   └── auth.ts           # Firebase auth service
│   │   ├── types/
│   │   │   ├── task.ts           # Task + Weather interfaces
│   │   │   └── index.ts          # Input type interfaces
│   │   └── utils/
│   │       └── tagStyles.ts      # Tag colour helper
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── package.json
│   └── .env                      # Not committed
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Notes

- The weather.com API key provided in the task brief appeared to be inactive. OpenWeatherMap free tier was used as a working alternative.
- The Firebase service account JSON and all `.env` files are excluded from the repository via `.gitignore`. These will be sent separately.
- AWS EC2 with Docker is used as the AWS service requirement.