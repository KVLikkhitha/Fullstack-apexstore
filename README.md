# 🛍️ ApexStore — Full-Stack E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Storefront-brightgreen?style=for-the-badge&logo=vercel)](https://apexstore-frontend-two.vercel.app/)
[![Backend Status](https://img.shields.io/badge/API-Render%20Cloud-blue?style=for-the-badge&logo=render)](https://apexstore-frontend-two.vercel.app/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A production-ready, high-performance, full-stack E-Commerce web application featuring a modern React storefront and a comprehensive Admin ERP Dashboard, powered by Express 5, TypeScript, and MongoDB.

---

## 🌐 Live Deployment Links

| Service | Hosting Provider | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** | **Vercel** | [https://apexstore-frontend-two.vercel.app/](https://apexstore-frontend-two.vercel.app/) | ![Live](https://img.shields.io/badge/Status-Online-success) |
| **Backend REST API** | **Render** | Production Cloud API (`/api/v1`) | ![Live](https://img.shields.io/badge/Status-Online-success) |
| **Cloud Database** | **MongoDB Atlas** | M0 Replicated Cluster (`Ecommerce_2026`) | ![Active](https://img.shields.io/badge/Status-Active-success) |

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Interactive Product Catalog**: Instant category filtering, real-time search, price range sliders, and multi-criteria sorting (Price Low-to-High, High-to-Low).
- **Smooth Shopping Experience**: Zero-jitter hover animations with GPU acceleration and unified hit-area bridges.
- **Cart & Dynamic Pricing**: Real-time quantity adjustments, promotional coupon discounts, automatic 18% tax calculation, and free shipping on orders over $200.
- **Wishlist Management**: One-click wishlist toggling with deduplicated, instant toast notifications.
- **Data-Driven Authentication**: Secure user registration, login, and profile tracking synced directly with MongoDB.

### 📊 Enterprise Admin Dashboard
- **Executive Analytics**: Real-time KPI summary cards displaying Total Revenue, Active Users, Total Orders, and Inventory Counts.
- **Low Inventory Alerts**: Automated stock radar flagging items with $\le 5$ units remaining to prevent out-of-stock events.
- **Order Management Center**: Interactive order lifecycle filter tabs (`All`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) with live status counters.
- **Visual Analytics**: Interactive Bar, Doughnut, and Line charts powered by Chart.js for tracking quarterly revenue, customer demographics, and order fulfillment ratios.
- **Product & Inventory Control**: Complete CRUD capabilities for catalog items with image upload support via Multer.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: SCSS / Sass (Modular Architecture)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **State & Alerts**: React Context API, [React Hot Toast](https://react-hot-toast.com/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Caching**: [Node-Cache](https://github.com/node-cache/node-cache) (In-memory caching for sub-millisecond catalog reads)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) with cross-platform normalized paths
- **Security & Logging**: Morgan, CORS protection, custom error handling middleware

### **DevOps & Infrastructure**
- **Containerization**: Multi-stage Docker builds & `docker-compose.yml` with health check dependencies
- **CI/CD & Cloud Hosting**: Automated Git pushes to Vercel (Frontend) and Render (Backend)

---

## 📁 Repository Structure

```text
Fullstack-apexstore/
├── Ecommerce_Frontend_React/    # React 19 + TypeScript + Vite Client
│   ├── src/
│   │   ├── assets/              # Static media & illustrations
│   │   ├── components/          # Reusable UI, Admin Sidebar, Modals
│   │   ├── context/             # Global Store & Auth State Management
│   │   ├── pages/               # Storefront & Admin route components
│   │   ├── services/            # Axios / Fetch API client configurations
│   │   ├── styles/              # Modular SCSS stylesheets
│   │   └── types/               # TypeScript interfaces & types
│   ├── vercel.json              # Vercel SPA rewrite routing config
│   ├── Dockerfile               # Multi-stage production Nginx container
│   └── package.json
│
├── Ecommerce_Backend/           # Express 5 + TypeScript + MongoDB Server
│   ├── src/
│   │   ├── controllers/         # Request handling logic (User, Product, Order, Stats)
│   │   ├── middlewares/         # Auth verification, error handling, Multer upload
│   │   ├── models/              # Mongoose schemas (User, Product, Order, Coupon)
│   │   ├── routes/              # Express API endpoint definitions
│   │   ├── utils/               # Database connection, cache invalidation, seeder
│   │   └── app.ts               # Express application entrypoint
│   ├── Dockerfile               # Production Node.js Alpine container
│   └── package.json
│
├── docker-compose.yml           # Unified orchestration for full-stack local deployment
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) installed locally OR a MongoDB Atlas cluster URI
- *(Optional)* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Method 1: Running with Docker Compose (Recommended)

Run the entire full-stack application (Frontend + Backend + MongoDB) with a single command:

```bash
docker-compose up --build
```

- **Frontend**: Access at `http://localhost:80`
- **Backend API**: Access at `http://localhost:4000/api/v1`

---

### Method 2: Manual Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/KVLikkhitha/Fullstack-apexstore.git
cd Fullstack-apexstore
```

#### 2. Backend Setup
```bash
cd Ecommerce_Backend

# Install dependencies
npm install

# Create environment configuration
# Copy .env.example to .env and configure your values:
# PORT=4000
# MONGO_URI=mongodb://localhost:27017/Ecommerce_2026
# CLIENT_URL=http://localhost:5173

# Build TypeScript code
npm run build

# Start the server (includes automatic seeding on first launch)
npm start
```

The backend server will run at `http://localhost:4000`.

#### 3. Frontend Setup
In a new terminal window:
```bash
cd Ecommerce_Frontend_React

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the storefront!

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/product/latest` | Retrieve latest 5 products (Cached) |
| `GET` | `/api/v1/product/all` | Search & filter products with pagination |
| `POST` | `/api/v1/product/new` | Create product with image upload (Admin) |
| `GET` | `/api/v1/order/my` | Retrieve logged-in user order history |
| `POST` | `/api/v1/order/new` | Place a new customer order |
| `GET` | `/api/v1/dashboard/stats` | Retrieve analytical dashboard KPIs & percentages |
| `GET` | `/api/v1/dashboard/pie` | Retrieve order fulfillment & category breakdown |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
