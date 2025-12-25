# DreamKnot E-commerce Application

A modern, full-stack e-commerce platform built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: NextAuth.js with secure user management
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: RazorPay integration for secure payments
- **Email**: Gmail SMTP for transactional emails
- **Admin Panel**: Comprehensive admin dashboard
- **Product Management**: Advanced product catalog with categories
- **Shopping Cart**: Persistent cart with local storage
- **Order Management**: Complete order lifecycle management
- **Reviews System**: Customer product reviews and ratings

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v3
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **Payments**: RazorPay
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Docker with multi-stage builds

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL database
- Docker & Docker Compose (for local development)

## 🚀 Production Deployment

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@dreamknot-db:5432/dreamknot?schema=public"
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
STRAPI_DB_PASSWORD=YOUR_DB_PASSWORD

# Next.js Configuration
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=https://your-domain.com

# Strapi Configuration
JWT_SECRET=YOUR_JWT_SECRET
ADMIN_JWT_SECRET=YOUR_ADMIN_JWT_SECRET
API_TOKEN_SALT=YOUR_API_TOKEN_SALT
APP_KEYS=your_app_key_1,your_app_key_2,your_app_key_3

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@yourdomain.com
PGADMIN_DEFAULT_PASSWORD=YOUR_PGADMIN_PASSWORD

# Email Configuration (Gmail SMTP)
EMAIL_FROM=your-email@gmail.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=YOUR_GMAIL_APP_PASSWORD

# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://dreamknot-strapi:1337

# RazorPay Configuration
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

### Coolify Deployment

1. **Connect Repository**: Link your GitHub repository to Coolify
2. **Configure Environment**: Set all environment variables in Coolify dashboard
3. **Database Setup**: Configure PostgreSQL service in Coolify
4. **Build Settings**: Use the provided Dockerfile for automatic builds
5. **Domain**: Configure your custom domain

### Docker Build Process

The application uses multi-stage Docker builds for optimal production images:

1. **Builder Stage**: Installs dependencies, generates Prisma client, builds Next.js
2. **Runtime Stage**: Contains only the optimized standalone output

### CI/CD Pipeline

GitLab CI/CD is configured with:
- **Lint Stage**: ESLint and TypeScript checking
- **Build Stage**: Docker image building
- **Deploy Stage**: Pushing to GitLab Container Registry

## 🏃‍♂️ Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KameshEas/dreamknot-ecommerce.git
   cd dreamknot-ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

6. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── admin/          # Admin dashboard
│   │   └── ...             # Other pages
│   ├── components/         # Reusable components
│   └── lib/                # Utility functions
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── docker/                 # Docker-related files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checking
- `npm run prisma` - Run Prisma commands

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID
- `GET /api/categories` - Get product categories

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Admin
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/[id]` - Update order status (admin)

## 🔐 Security Features

- **Authentication**: Secure JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Prisma ORM safeguards
- **XSS Protection**: Next.js built-in protections
- **CSRF Protection**: NextAuth.js CSRF protection

## 📊 Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: ISR for product pages
- **Caching**: Redis-ready architecture
- **Bundle Analysis**: Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.
