# 🔄 Real-Time Collaborative To-Do Manager

A full-stack MERN web app where multiple users can register, manage tasks, and collaborate in real-time—similar to a minimal Trello board but with custom logic like Smart Assign and conflict resolution.

---

## 🧰 Tech Stack

- **Frontend**: React, Axios, Socket.IO-client
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO, JWT, bcrypt
- **Deployment**:
  - Frontend: Vercel / Netlify
  - Backend: Render / Railway
- **Version Control**: Git & GitHub

---

## ✨ Features

### 🔐 Authentication
- User Registration & Login with hashed passwords
- JWT-based session management

### 🗂 Kanban Board
- Columns: `To Do`, `In Progress`, `Done`
- Drag & drop tasks between columns
- Reassign tasks to other users

### 🔁 Real-Time Collaboration
- Live updates across all users using WebSockets (Socket.IO)

### 🧠 Smart Assign
- Automatically assigns a task to the user with the fewest active tasks

### ⚔️ Conflict Handling
- Detects when two users edit the same task simultaneously
- Prompts both users to **merge** or **overwrite**

### 📜 Activity Log
- Displays the last 20 actions (e.g., add, edit, delete, assign, drag-drop)
- Updates in real time

### 🎨 Custom UI
- Built with pure CSS (no UI libraries like Bootstrap or Material UI)
- Fully responsive for mobile and desktop
- Smooth animations on task movement

---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
````

### 2. Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`
Backend runs at `http://localhost:5000`

---

## 🧩 Business Logic Highlights

### ✅ Smart Assign Logic

When a user clicks the "Smart Assign" button on a task, the system:

* Fetches all users and their active tasks
* Determines which user has the **fewest active (non-done) tasks**
* Assigns the task to that user

### ⚠️ Conflict Resolution Logic

If two users try to edit the same task:

* System detects concurrent edit timestamps
* Prompts both users to either:

  * **Merge changes** (combine edits)
  * **Overwrite** (choose one version)


---

## 🗂 Folder Structure

```
.
├── backend
│   ├── models
│   ├── routes
│   ├── controllers
│   └── server.js
├── frontend
│   ├── components
│   ├── pages
│   └── App.js
├── Logic_Document.md
├── README.md
```

---

## 📹 Demo Video Walkthrough

* Login/Register flows
* Real-time Kanban drag-drop
* Smart Assign in action
* Conflict handling demo
* My favorite challenge & solution

🎥 [Watch here](https://www.linkedin.com/in/ganesh-belote-47a291277)

---

## 🙋‍♂️ Author

**Ganesh**
MERN Stack Developer & Intern at WebAlar
🔗 [LinkedIn](https://www.linkedin.com/in/ganesh-belote-47a291277)
📧 [ganeshbelote18@gmail.com](mailto:ganeshbelote18@gmail.com)



