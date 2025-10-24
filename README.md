# 🍽️ Kiosks Restaurant Ordering Web Application

A modern, full-stack restaurant ordering system built with **React.js**, **Node.js**, and **MongoDB**. This application provides a seamless ordering experience for customers and comprehensive management tools for restaurant administrators.

## 🚀 Live Demo

**Frontend:** [https://kiosks-restaurant-ordering-webapp.vercel.app](https://kiosks-restaurant-ordering-webapp.vercel.app)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Customer Features
- **🔐 User Authentication** - Secure registration and login system (Required for access)
- **📋 Browse Menu** - View restaurant menu with detailed item information
- **🛒 Add to Cart** - Shopping cart functionality with quantity management
- **❤️ Favorites System** - Save favorite menu items for quick access
- **📦 Order Placement** - Easy checkout and order submission
- **📜 Order History** - Track current and past orders
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

> **Note:** All features except registration and login require user authentication. The application automatically redirects unauthenticated users to the login page.

### Admin Features
- **Admin Dashboard** - Comprehensive overview of restaurant operations
- **Menu Management** - Create, edit, update, and delete menu items
- **Order Management** - View and manage customer orders
- **User Management** - Admin panel for user oversight
- **Real-time Updates** - Live order tracking and status updates

## 🛠️ Tech Stack

### Frontend
- **React.js 19** - Modern UI library with hooks
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp.git
cd Kiosks-Restaurant-Ordering-webapp
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and add your environment variables (see Environment Variables section)
cp .env.example .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🌐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/restaurant-ordering
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-ordering

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here



# Server Configuration
PORT=10000
NODE_ENV=development

# Admin Credentials (Optional - for seeding admin user)
ADMIN_EMAIL=user@gmail.com
ADMIN_PASSWORD=123
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=dpvx0odty
VITE_CLOUDINARY_UPLOAD_PRESET=kiosk-app

# API Configuration (Optional - defaults to localhost:10000 in development)
VITE_API_BASE_URL=http://localhost:10000
# For production:
# VITE_API_BASE_URL=https://your-backend-url.com
```

**Note:** The frontend uses Vite, so all environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

### API Configuration

The frontend is configured to work with the backend API. Update the API base URL in your axios configuration if needed:

```javascript
// In your API configuration file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://your-backend-url.com'
    : 'http://localhost:10000');
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**

```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:10000`

2. **Start the Frontend Development Server**

```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:10000`

### Production Mode

1. **Build the Frontend**

```bash
cd frontend
npm run build
```

2. **Start the Backend**

```bash
cd backend
npm start
```

## 📁 Project Structure

```
Restaurant-Ordering-Web-App/
│
├── 📁 backend/                      # Backend Node.js application
│   ├── 📁 controllers/              # Request handlers and business logic
│   │   ├── authController.js        # Authentication logic
│   │   ├── favoritesController.js   # Favorites management
│   │   ├── menuController.js        # Menu item operations
│   │   └── orderController.js       # Order processing
│   │
│   ├── 📁 middleware/               # Custom middleware
│   │   └── authMiddleware.js        # JWT authentication middleware
│   │
│   ├── 📁 models/                   # MongoDB schemas
│   │   ├── MenuItem.js              # Menu item schema
│   │   ├── Order.js                 # Order schema
│   │   └── User.js                  # User schema
│   │
│   ├── 📁 routes/                   # API route definitions
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── favoritesRoutes.js       # Favorites routes
│   │   ├── menuRoutes.js            # Menu routes
│   │   └── orderRoutes.js           # Order routes
│   │
│   ├── 📁 public/                   # Static files
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry point
│
├── 📁 frontend/                     # Frontend React application
│   ├── 📁 public/                   # Static assets
│   │
│   ├── 📁 src/                      # Source code
│   │   ├── 📁 assets/               # Images, icons, etc.
│   │   │
│   │   ├── 📁 components/           # Reusable React components
│   │   │   ├── AdminRoute.jsx       # Protected admin routes
│   │   │   └── BottomNavbar.jsx     # Mobile navigation
│   │   │
│   │   ├── 📁 pages/                # Page components
│   │   │   ├── CartPage.jsx         # Shopping cart
│   │   │   ├── FavoritesPage.jsx    # User favorites
│   │   │   ├── LoginPage.jsx        # User login
│   │   │   ├── MenuPage.jsx         # Menu display
│   │   │   ├── OrderHistoryPage.jsx # Order history
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   │
│   │   │   └── 📁 admin/            # Admin-only pages
│   │   │       ├── AdminDashboard.jsx      # Admin overview
│   │   │       ├── AdminMenuCreatePage.jsx # Create menu items
│   │   │       ├── AdminMenuEditPage.jsx   # Edit menu items
│   │   │       ├── AdminMenuManager.jsx    # Menu management
│   │   │       └── AdminOrderManager.jsx   # Order management
│   │   │
│   │   ├── 📁 redux/                # State management
│   │   │   ├── store.js             # Redux store configuration
│   │   │   │
│   │   │   └── 📁 slices/           # Redux Toolkit slices
│   │   │       ├── adminOrderSlice.js    # Admin order state
│   │   │       ├── authSlice.js          # Authentication state
│   │   │       ├── cartSlice.js          # Shopping cart state
│   │   │       ├── favoritesSlice.js     # Favorites state
│   │   │       ├── menuAdminSlice.js     # Admin menu state
│   │   │       ├── menuSlice.js          # Menu state
│   │   │       ├── myOrdersSlice.js      # User orders state
│   │   │       ├── navigationSlice.js    # Navigation state
│   │   │       └── orderSlice.js         # Order processing state
│   │   │
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css                  # Global styles
│   │   ├── MainLayout.jsx           # Main layout component
│   │   ├── index.css                # Tailwind CSS imports
│   │   └── main.jsx                 # React entry point
│   │
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vercel.json                  # Vercel deployment config
│   └── vite.config.js              # Vite configuration
│
└── README.md                        # Project documentation
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Menu Routes (`/api/menu`)
- `GET /` - Get all menu items
- `GET /:id` - Get specific menu item
- `POST /` - Create menu item (admin only)
- `PUT /:id` - Update menu item (admin only)
- `DELETE /:id` - Delete menu item (admin only)

### Order Routes (`/api/orders`)
- `GET /` - Get user orders (protected)
- `GET /all` - Get all orders (admin only)
- `POST /` - Create new order (protected)
- `PUT /:id/status` - Update order status (admin only)

### Favorites Routes (`/api/favorites`)
- `GET /` - Get user favorites (protected)
- `POST /` - Add item to favorites (protected)
- `DELETE /:menuItemId` - Remove from favorites (protected)

## � Authentication & Route Protection

### Authentication Flow
The application implements a secure authentication system using JWT tokens:

1. **Registration/Login** - Users must register or login to access the application
2. **Token Storage** - JWT tokens are stored in localStorage with user information
3. **Protected Routes** - All main application routes are protected and require authentication
4. **Auto-redirect** - Unauthenticated users are automatically redirected to login
5. **Persistent Sessions** - Users remain logged in across browser sessions via localStorage

### Route Protection
- **Public Routes:** `/login`, `/register` - Accessible without authentication
- **Private Routes:** `/` (main app), `/menu`, `/cart`, `/orders`, `/favorites` - Require login
- **Admin Routes:** `/admin/dashboard*` - Require login + admin privileges

### Components
- `PrivateRoute` - Protects customer routes, redirects to login if not authenticated
- `AdminRoute` - Protects admin routes, redirects to login if not authenticated or not admin
- Authentication state managed via Redux with localStorage persistence

## �👥 User Roles

### Customer
- Browse menu items
- Add items to cart and favorites
- Place orders
- View order history
- Manage profile

### Admin
- All customer privileges
- Create, edit, and delete menu items
- View and manage all orders
- Access admin dashboard
- Manage user accounts

### Default Admin Credentials
- **Email:** user@gmail.com
- **Password:** 123

*Note: Change these credentials in production*

## 🎨 Screenshots

*Add screenshots of your application here to showcase the UI/UX*

## 🚀 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel and automatically deploys from the main branch.

### Backend (Railway/Heroku/DigitalOcean)
1. Set up environment variables
2. Configure MongoDB Atlas
3. Deploy using your preferred platform

### Environment Setup for Production
- Update CORS origins in `server.js`
- Set production MongoDB URI
- Configure JWT secrets
- Set proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shaikh Suja Rahaman**
- GitHub: [@Shaikh-Suja-Rahaman](https://github.com/Shaikh-Suja-Rahaman)

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing [Issues](https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp/issues)
2. Create a new issue if needed
3. Contact the author

---

⭐ **Star this repository if you found it helpful!** ⭐
