🖼️ AI Image Generation SaaS Platform

A full-stack AI Image Generation SaaS that lets users generate images from text prompts, manage credits, and purchase additional credits using Razorpay.
Built with production-level frontend & backend deployment, secure authentication, payment verification, and credit management.

🚀 Live Demo

Frontend (Vercel): https://ai-image-generation-saas-platform.vercel.app

Backend: Deployed on AWS EC2, securely exposed over HTTPS via Cloudflare Tunnel

✨ Features

🔐 Authentication: JWT-based Login & Signup

🎨 AI Image Generation: Text → Image using ClipDrop API

💳 Credit System: Free signup credits + per-generation deduction

💰 Payments: Buy credits via Razorpay (Test Mode) with backend HMAC verification

📊 Real-time Credit Updates

☁️ Production Deployment: Vercel (Frontend) + EC2 (Backend) + Cloudflare HTTPS

🧠 Tech Stack

Frontend: React (Vite), Tailwind CSS, Axios, React Router, Razorpay SDK
Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, Razorpay API, ClipDrop API, PM2
Deployment: Vercel · AWS EC2 · Cloudflare Tunnel

🏗️ Architecture
Browser → Vercel (HTTPS) → Cloudflare Tunnel → AWS EC2 (Node/Express)
                                     → MongoDB | ClipDrop | Razorpay


This setup avoids mixed-content issues and enables free HTTPS without paid SSL.

🔒 Security

JWT authentication

Backend-only credit deduction

Razorpay payment verification (HMAC SHA-256)

CORS protection

No sensitive keys exposed to frontend

🧪 Razorpay (Test Mode)

Uses Razorpay Test Mode

No real money involved

Ideal for demos and resume projects

👤 Author

Ayush Kumar
IMSc Mathematics & Computing, BIT Mesra
GitHub: https://github.com/ayush1203kr
