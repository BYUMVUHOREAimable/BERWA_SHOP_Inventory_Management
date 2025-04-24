
# BERWA SHOP Inventory Management System

A web application for managing inventory at BERWA SHOP, a store selling shoes and clothes. This application allows the shopkeeper to track stock in/out, manage products, and generate reports.

## Features

- User Authentication (Register/Login)
- Product Management (CRUD operations)
- Stock-In and Stock-Out Tracking
- Reporting (Daily, Weekly, Monthly, All-time)
- Dashboard with inventory overview

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- MongoDB database
- JWT for authentication
- Mongoose for ODM

## Project Structure

```
├── backend/             # Node.js backend
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   └── App.tsx          # Main app component
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BYUMVUHOREAimable/BERWA_SHOP_Inventory_Management.git
cd BERWA_SHOP_Inventory_Management
```
1b. in backend folder:
create
```.env and add these:
PORT=5000
MONGODB_URI=
JWT_SECRET=berwa_shop_secret
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

### Running the Application

1. Start MongoDB server:
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
# In another terminal, from the project root
npm run dev
```

4. Open your browser and navigate to http://localhost:8080

## Database Structure

- **Shopkeeper**: User authentication data
  - ShopkeeperId (PK)
  - UserName
  - Password

- **Product**: Basic product information
  - ProductCode (PK)
  - ProductName

- **ProductIn**: Records of products coming into inventory
  - ProductCode (FK)
  - Date
  - Quantity
  - UniquePrice (per unit)
  - TotalPrice

- **ProductOut**: Records of products leaving inventory
  - ProductCode (FK)
  - Date
  - Quantity
  - UniquePrice (per unit)
  - TotalPrice

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new shopkeeper
- `POST /api/auth/login` - Login a shopkeeper

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:productCode` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:productCode` - Update a product
- `DELETE /api/products/:productCode` - Delete a product

### Stock-In
- `GET /api/product-in` - Get all stock-in records
- `POST /api/product-in` - Create a new stock-in record

### Stock-Out
- `GET /api/product-out` - Get all stock-out records
- `POST /api/product-out` - Create a new stock-out record

### Reports
- `GET /api/reports/dashboard` - Get dashboard data
- `GET /api/reports/:reportType` - Get report data (daily, weekly, monthly, all)

## License

This project is created for educational purposes.

## Author

BERWA SHOP Inventory Management System
