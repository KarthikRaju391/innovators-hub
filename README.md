# Innovators' Hub

A platform for builders to showcase vibe-coded POCs, build a community of supporters, iterate in public, and get real feedback on their ideas.

**Think: Product Hunt + Patreon + [Dev.to](http://Dev.to) for solo developers and builders.**

## Features

### For Builders/Creators

- **Project Showcase**: Publish vibe-coded POCs with demo links, GitHub repos, and AI tools used
- **Version Tracking**: Auto-pull release notes from README; supporters get early access (1 week before public)
- **Journey Posts**: Share your building process—what you learned, roadblocks, ideas for next version (public or supporter-exclusive)
- **Supporters**: Monetize via 3 tiers (one-time payment): 
  - Hype Supporter (free) - Shows support, starts discussions
  - Early Access Supporter ($5) - Early version access + exclusive posts
  - Champion Supporter ($15) - Direct creator messaging + featured badge
- **Creator Profile**: Portfolio of projects, supporter count, AI tools used, journey timeline

### For Community

- **Discussions**: Threaded discussions under projects (supporters + creators can start, everyone can comment)
- **Discovery**: Filter by AI tool tags (Claude Code, Cursor, etc.), tech stack, trending, supporters
- **Feedback**: Upvote projects, comment, and support builders you believe in

### For Platform

- **AI Tool Tags**: Specific tool attribution ("Built with Claude Code") with clickable discovery
- **Community-Driven**: Engagement-based visibility (discussions, upvotes, supporter count)
- **Notifications**: Stay updated on new versions, journey posts, and discussion replies

---

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

- **Razorpay**: Payment gateway (supporter tiers)
- **Firebase**: File storage (project images)
- **GitHub API**: Auto-fetch README for release notes

### DevOps & Tools

- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting
- **Autoprefixer + PostCSS**: CSS processing

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account
- Razorpay account
- Firebase project
- GitHub OAuth token (for README fetching)

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

3. Set up environment variables:\
   Create a `.env.local` file with the following variables:

```markdown
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
GITHUB_TOKEN="..."
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

Open <http://localhost:3000> in your browser.

---

## User Flows

### Creator: Publishing a Project

1. Sign up / log in
2. Create new project (title, description, demo link, repo link)
3. Select AI tools used (tags)
4. Publish
5. Share with community
6. Post journey updates (public or supporter-exclusive)
7. Release new versions (supporters get 1-week early access)
8. Monitor discussions and respond

### Supporter: Finding & Supporting

1. Browse projects by AI tool tag, trending, or tech stack
2. View project, read discussions, check journey posts
3. Choose support tier (Hype / Early Access / Champion)
4. Get early access to versions and exclusive content
5. Participate in discussions

---

## Documentation

See [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) for detailed feature spec, data model, and roadmap.

---

## Project Structure

```markdown
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
├── PRODUCT_SPEC.md     # Detailed product specification
└── ...
```

---

## Contributing

Contributions welcome! Please:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT License - See [LICENSE.md](./LICENSE.md)

---

## Support

- **Issues**: Create an issue on GitHub
- **Discussions**: Start a discussion in the GitHub Discussions tab
- **Email**: [innovators-hub-team@example.com](mailto:innovators-hub-team@example.com)

---

## Roadmap

### Phase 1 (MVP)

- ✅ Product spec finalized
- 🔄 Core schema and API
- 🔄 Project showcase pages
- 🔄 Support tier system (Razorpay integration)
- 🔄 Discussions and comments
- 🔄 Journey posts
- 🔄 Creator profiles

### Phase 2

- Analytics dashboard for creators
- GitHub-to-project sync automation
- AI tool badge customization
- Community recommendations
- Search and advanced filtering

### Phase 3

- Mobile app
- Email digests
- Creator collaboration features
- Analytics and insights
- Community events/hackathons

---

## Built with ❤️ for builders