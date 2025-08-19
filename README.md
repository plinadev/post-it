# Post It 📝

A **full-stack Twitter-like social media app** built with **Firebase (Auth, Firestore, Storage, Functions)**, **NestJS** backend, and a **React + TailwindCSS** frontend.  
Users can sign up, sign in, create posts with images, like/dislike, comment (and reply to comments), and manage their profiles.

---

## 🚀 Features

### 🔐 Authentication
- Sign up with **email & password** (with email verification)  
- Sign up with **Google account** 
- Sign in with **email & password**  
- Sign in with **SMS code (experimental/partial)** ⚡️  
- Forgot password (reset via email)  
- Change password  
- Log out  
- Delete account   

### 👤 User Profile
- Update **username and profile photo**   
- Manage account settings   

### 📝 Posts
- Create posts with **title, text, and optional photo**   
- Edit posts (title, text, photo)   
- Delete posts   
- View my posts   
- View other users’ posts on their profile   
- Paginated feed **sorted by likes & comments**   
- Search posts by text (Algolia full-text search with suggestions)   

### ❤️ Likes & Dislikes
- Like or dislike posts   
- Switch between like/dislike   
- Remove reaction   
- One reaction (like OR dislike) per user per post   

### 💬 Comments & Replies
- Add comments   
- Edit comments   
- Delete comments   
- Reply to comments   

---

## 🛠️ Tech Stack

### Frontend
- [React 19](https://react.dev/)  
- [React Router v7](https://reactrouter.com/)  
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)  
- [TanStack React Query](https://tanstack.com/query/latest) (data fetching & caching)  
- [TailwindCSS v4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)  
- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)  
- [Axios](https://axios-http.com/)  
- [React Hot Toast](https://react-hot-toast.com/)  
- [Date-fns](https://date-fns.org/)  
- [React Icons](https://react-icons.github.io/react-icons/)  

### Backend
- [NestJS 11](https://nestjs.com/)  
- [Firebase Functions](https://firebase.google.com/docs/functions)  
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)  
- [Firestore](https://firebase.google.com/docs/firestore) (database)  
- [Firebase Storage](https://firebase.google.com/docs/storage) (for profile/post images)  
- [Algolia](https://www.algolia.com/) (optional: full-text search)  
- [Multer](https://github.com/expressjs/multer) (file uploads)  
- [Busboy](https://www.npmjs.com/package/busboy)  

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Backend (`.env`)
```env
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_API_KEY=
ALGOLIA_INDEX_NAME=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## 📂 Project Structure
```
post-it/
│── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   └── public/
│
│── backend/           # NestJS app inside Firebase Functions
│   ├── src/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── likes/
│   │   └── users/
│   └── main.ts
│
└── firebase.json      # Firebase hosting & functions config
```

---

## 🏗️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/plinadev/post-it.git
cd post-it
```

### 2️⃣ Install dependencies
Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

### 3️⃣ Configure Firebase
- Create a new Firebase project  
- Enable:
  - Authentication (Email/Password + Google + optionally Phone)  
  - Firestore Database  
  - Storage  
- Copy your Firebase config into `.env` files  

### 4️⃣ Run locally
Frontend:
```bash
cd frontend
npm run dev
```

Backend (Firebase Functions with NestJS):
```bash
cd backend
npm run start:dev
```

### 5️⃣ Deploy
Frontend (Firebase Hosting):
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

Backend (Firebase Functions):
```bash
cd backend
firebase deploy --only functions
```

---

## 🔎 Search (Optional)
- By default, search uses Firestore queries.  
- For advanced full-text search:
  - Install the **Algolia Firebase extension**  
  - Configure `.env` with Algolia credentials  

---

