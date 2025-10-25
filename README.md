# Innovators' Hub

A comprehensive platform designed to empower early-stage entrepreneurs by providing a crowdfunding solution for innovative projects and an e-commerce marketplace for startup products. Built with modern technologies, Innovators' Hub facilitates connections between entrepreneurs, investors, and the community, enabling startups to thrive through funding and product sales.

## Features

### For Entrepreneurs
- **Project Showcase**: Display your vibe-coded projects, prototypes, and MVPs with detailed descriptions, tech stacks, and demo links.
- **Startup Registration**: Register your startup with essential details like PAN, GST, location, and business categorization.
- **Product Marketplace**: List and sell your startup's products directly through the platform.
- **Community Engagement**: Create posts and engage with the community through comments and discussions.

### For Investors
- **Project Discovery**: Browse and explore innovative projects across various categories and investment stages.
- **Investment Opportunities**: Fund projects at different stages (Seed, Angel, Series A, etc.) and track your investments.
- **Meeting Scheduling**: Arrange meetings with entrepreneurs to discuss potential investments.

### For Users
- **Product Shopping**: Discover and purchase products from innovative startups with secure Razorpay integration.
- **Community Forum**: Participate in discussions, read posts, and provide feedback on projects.
- **Latest Tech News**: Stay updated with the latest technology news from Hacker News.

### Platform Features
- **Secure Authentication**: User registration and login with email/phone verification using Supabase.
- **Order Management**: Track orders from purchase to delivery, integrated with Indian Postal Service.
- **Payment Processing**: Secure payments through Razorpay for both investments and product purchases.
- **File Storage**: Firebase integration for storing images and project files.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and Radix UI components.

## Tech Stack

### Frontend
- **Next.js 14**: React framework for server-side rendering and routing
- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Lucide React**: Icon library
- **React Hook Form + Zod**: Form handling and validation

### Backend & Database
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Database ORM with PostgreSQL
- **Supabase**: Authentication and real-time features
- **NextAuth.js**: Authentication framework

### Integrations
- **Razorpay**: Payment gateway
- **Firebase**: File storage
- **Hacker News API**: Latest tech news
- **Indian Postal Service**: Product delivery

### DevOps & Tools
- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting
- **Autoprefixer + PostCSS**: CSS processing

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account
- Razorpay account
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KarthikRaju391/innovators-hub.git
cd innovators-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
SUPABASE_URL="..."
SUPABASE_ANON_KEY="..."
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
FIREBASE_API_KEY="..."
FIREBASE_AUTH_DOMAIN="..."
FIREBASE_PROJECT_ID="..."
FIREBASE_STORAGE_BUCKET="..."
FIREBASE_MESSAGING_SENDER_ID="..."
FIREBASE_APP_ID="..."
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### For Entrepreneurs
1. Register as an entrepreneur and create your startup profile.
2. Add projects with descriptions, tech stacks, and demo links.
3. List products for sale in the marketplace.
4. Engage with investors through scheduled meetings.

### For Investors
1. Browse projects and filter by category or investment stage.
2. Invest in promising projects through the platform.
3. Schedule meetings with entrepreneurs for detailed discussions.

### For Users
1. Explore products from various startups and add to cart.
2. Complete purchases with secure Razorpay payments.
3. Participate in the community forum and provide feedback.

## Project Structure

```
innovators-hub/
├── components/          # Reusable React components
├── constants/           # Application constants
├── context/             # React context providers
├── lib/                 # Utility functions and custom hooks
├── pages/               # Next.js pages and API routes
│   ├── api/            # API endpoints
│   └── ...             # Page components
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── styles/             # Global styles
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For support, please contact the development team or create an issue in the repository.
