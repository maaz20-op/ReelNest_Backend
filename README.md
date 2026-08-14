# 🎬 ReelNest Backend

**ReelNest Backend is a scalable Node.js and Express.js backend powering the ReelNest social media platform.**

It provides the core APIs, authentication, database operations, real-time communication, media management, background processing, and business logic required by the ReelNest frontend.

The backend is responsible for features including **posts, reels, likes, comments, followers/following, user blocking, private accounts, profile management, authentication, real-time chat, WebRTC signaling, Cloudinary media handling, email services, Redis/BullMQ background processing, and premium subscription functionality.**

---

### 🌐 Live ReelNest Demo

**ReelNest Frontend**
https://reel-nest-frontend.vercel.app/

## ✨ Features

### 🔐 Authentication & Authorization

- Local email/password authentication
- Google OAuth authentication using Passport.js
- Cookie-based authentication
- Secure session handling
- Protected routes
- Authentication middleware
- Forgot password
- Password reset
- Password update
- Secure logout
- Access-controlled resources

### 👤 User & Account Management

- User registration
- User login/logout
- Update username
- Update full name
- Update bio
- Update profile image/avatar
- Update password
- Account settings
- Private/public account system
- User profile management

### 👥 Social Features

- Follow users
- Unfollow users
- Followers management
- Following management
- Block users
- Unblock users
- Private account access control
- User relationship management

### 📝 Posts & Reels

- Create posts
- Upload images/videos
- Create reels
- Fetch posts
- Paginated feeds
- User-specific posts
- Delete posts
- Access-controlled posts
- Private account content protection

### ❤️ Like System

- Like posts
- Unlike posts
- Like count management
- User-specific like state
- Optimized like operations

### 💬 Comments

- Add comments
- Fetch comments
- Delete comments
- Comment-related user information
- Comment pagination

### 💬 Real-Time Chat

ReelNest uses **Socket.IO** to provide real-time communication between users.

The Socket.IO server handles:

- Real-time private messaging
- Message delivery
- Online/offline user events
- Socket connection management
- User-to-user communication
- Real-time chat events

### 🎥 WebRTC Video Calling

ReelNest uses **WebRTC** for peer-to-peer video communication.

The backend Socket.IO server acts as the **signaling server** responsible for exchanging the information required to establish the WebRTC connection.

```text
                    ReelNest Backend
                   Socket.IO Server
                         │
                  WebRTC Signaling
                   ┌─────┴─────┐
                   │           │
                User A       User B
                   │           │
                   └──── WebRTC ────┘
                    Peer-to-Peer
                 Video + Audio
```

### Email Feature

ReelNest uses a Libaray nodemailer for sending emails, on Signup and Login as well as for OTP

---

## 🏗️ Backend Folder Structure

The ReelNest backend follows a modular and feature-based architecture using **Node.js, Express.js, MongoDB, Socket.IO, Redis, BullMQ, and Passport.js**.

```text
ReelNest_Backend/
│
├── 📁 bin/
│   └── Server startup / application initialization files
│
├── 📁 changeStreams/
│   └── 📄 userWatcher.js
│       └── MongoDB Change Stream listener for user-related events
│
├── 📁 config/
│   ├── 📄 cloudinary.js
│   ├── 📄 googlePassport.js
│   ├── 📄 multerConfig.js
│   ├── 📄 nodemailerConfig.js
│   └── 📄 redisClient.js
│
├── 📁 controller/
│   │
│   ├── 📁 app/
│   │   ├── 📄 Ai_feature.js
│   │   ├── 📄 comment.js
│   │   ├── 📄 message.js
│   │   ├── 📄 payment.js
│   │   ├── 📄 pin.js
│   │   ├── 📄 post.js
│   │   └── 📄 user.js
│   │
│   └── 📁 auth/
│       ├── 📄 googleController.js
│       └── 📄 localController.js
│
├── 📁 emails/
│   ├── 📄 signupWelcome.js
│   └── 📄 verifyOtpEmail.js
│
├── 📁 middlewares/
│   ├── 📄 globalErrorHandler.js
│   ├── 📄 isLoggedIn.js
│   ├── 📄 loginRequestLimiter.js
│   ├── 📄 redisCacheMiddleware.js
│   ├── 📄 registerRequestLimiter.js
│   └── 📄 securityMiddlewares.js
│
├── 📁 models/
│   ├── 📄 comment-model.js
│   ├── 📄 message-model.js
│   ├── 📄 pin-model.js
│   ├── 📄 post-model.js
│   └── 📄 user-model.js
│
├── 📁 public/
│   ├── 📁 images/
│   │   └── 📁 uploads/
│   └── 📄 sitemap.xml
│
├── 📁 queues/
│   └── 📄 emailQueue.js
│
├── 📁 routes/
│   └── 📁 api/
│       └── 📁 v1/
│           ├── 📄 index.js
│           │
│           ├── 📁 auth/
│           │   ├── 📄 google.js
│           │   └── 📄 local.js
│           │
│           └── 📁 features/
│               ├── 📄 ai-huggyFaceApi.js
│               ├── 📄 commentApi.js
│               ├── 📄 messageApi.js
│               ├── 📄 paymentApi.js
│               ├── 📄 pinApi.js
│               ├── 📄 postApi.js
│               └── 📄 userApi.js
│
├── 📁 socket/
│   └── 📄 message-sockets-connection.js
│       └── Socket.IO server for real-time messaging
│           and WebRTC signaling
│
├── 📁 tests/
│   └── 📄 auth.test.js
│
├── 📁 test-results/
│   └── Test execution results
│
├── 📁 utils/
│   ├── 📄 ApiRoute.js
│   ├── 📄 apiError.js
│   ├── 📄 apiResponse.js
│   ├── 📄 asyncErrorHandler.js
│   ├── 📄 deleteImageFromCloudinary.js
│   ├── 📄 generateOTP.js
│   ├── 📄 generateToken.js
│   ├── 📄 noSQLPreventionTechniques.js
│   ├── 📄 sendAccessAndRefreshTokenThroughCookie.js
│   ├── 📄 setAndGetRedisKeys.js
│   └── 📄 webRoute.js
│
├── 📄 app.js
├── 📄 ecosystem.config.js
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 vercel.json
├── 📄 .gitignore
└── 📄 README.md

```

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maaz20-op/ReelNest_Backend.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

## 👨‍💻 Author

**Maaz Javed**

- GitHub: https://github.com/maaz20-op
- LinkedIn: https://www.linkedin.com/in/maaz-javed-4793b9363/
- Portfolio: https://my-portfolio-e.vercel.app/

---

## 📄 License

This project is developed for educational and portfolio purposes.
