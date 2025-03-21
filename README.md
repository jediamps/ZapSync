
# 🚀 Zap Sync

> **A cloud-based file-sharing system with AI-powered security and anomaly detection.**

Zap Sync is a modern alternative to traditional file-sharing platforms like Google Drive. Built with security and user experience in mind, it allows users to share and manage files seamlessly while leveraging AI to detect unusual or suspicious activities in real-time.

---

## 🎯 **Key Features**

- ✅ **Google OAuth2 Authentication** (Secure user login & registration)  
- ✅ **MySQL-Powered User Management**  
- ✅ **Cloud File Upload & Storage System**  
- ✅ **AI-Based Anomaly Detection** (Isolation Forest Model)  
- ✅ **Role-less, user-centric design (No admin dashboard)**  
- ✅ **Smart Permissions & Encrypted File Sharing**  
- ✅ **ZeroTier VPN-Ready for private network usage**

---

## 🛠 **Tech Stack**

### **Backend**
- Django Rest Framework (DRF)
- Python 3.11+
- MySQL
- social-auth-app-django (OAuth2)
- djangorestframework-simplejwt (JWT Tokens)
- Scikit-learn (AI Models)

### **Frontend**
- React js (with Vite)
- React Google OAuth2 client
- Axios (API requests)

### **Other**
- ZeroTier (for secure remote connections)

---

## 🗂 **Project Structure**

```
zap-sync/
├── backend/               # Django backend (APIs, AI logic)
│   ├── zap_sync_backend/
│   ├── ai_models/
│   └── manage.py
├── frontend/              # React frontend (UI)
│   └── src/
├── dataset/               # AI datasets, reports, anomaly logs
├── docker-compose.yml     # Multi-container Docker setup
├── README.md              # Project overview
└── docs/                  # Documentation & design notes
```

---

## 🚀 **Setup Instructions**

### **1️⃣ Backend Setup (Django + MySQL)**

```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### **2️⃣ Frontend Setup (React)**
```bash
cd frontend
npm install
npm run dev
```

### **3️⃣ Environment Variables**

Create a `.env` file for both frontend and backend with:

For backend:  
```bash
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your-google-client-id
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your-google-client-secret
DATABASE_NAME=zap_sync_db
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
```

For frontend:  
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## ⚙️ **Core Modules**

### 🔐 **Authentication Module**
- Google OAuth2-based login
- JWT token issuance
- User information securely stored in MySQL

### 📁 **File Upload & Sharing Module**
- File uploads to cloud storage (AWS S3 or Firebase)
- Metadata tracking (size, type, upload time)

### 🧠 **AI Security Module**
- Isolation Forest model to detect anomalous file-sharing behaviors
- Automatically flag suspicious user activity for review

---

## 📈 **Roadmap**

- [x] Phase 0: Project Setup (React + Django + MySQL)
- [x] Phase 1: User Registration & OAuth2 Authentication
- [ ] Phase 2: File Upload & Cloud Storage
- [ ] Phase 3: AI-based Anomaly Detection Integration
- [ ] Phase 4: Smart Permissions & File Encryption
- [ ] Phase 5: Full Deployment on Cloud & VPN Integration

---

## 👨‍💻 **Contributors**

- **Project Lead:** Eugene Anokye
- **Collaborators:** Jedidiah

---

## 📜 **License**

MIT License © ZapSync Team 2025

---
