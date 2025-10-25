# Innovators' Hub - Product Specification v2

## Mission
Empower solo developers and builders to showcase vibe-coded POCs, get community feedback, build supporters, and iterate in public.

---

## Core Product Features

### 1. Project Showcase
**Purpose:** Builders share their vibe-coded projects publicly

- **Project Page contains:**
  - Project title and description
  - Demo/live link
  - GitHub/code repository link
  - AI tools used tags (Claude Code, Codex, ChatGPT, Cursor, GitHub Copilot, etc.)
  - Tech stack
  - Creator info
  - Support/donation button

- **Versions:**
  - Automatic version tracking (v1, v2, v3...)
  - Release notes auto-pulled from README of project repository
  - Version access levels: public or supporters-only
  - 1-week early access for supporters on new versions before public release

- **AI Tool Tags (Clickable):**
  - Specific agent tags: "Built with Claude Code", "Built with Cursor", etc.
  - Filterable across platform (e.g., "Show me all projects built with Claude Code")
  - Creator self-selects based on tools actually used

### 2. Journey Posts
**Purpose:** Creator shares their iteration story and progress

- **Timeline of posts:**
  - Separate from version releases
  - Examples: "Started building with Claude Code", "Hit a blocker with X", "Learned Y this week", "Roadmap for v2"
  - Shows builder's creative process and learning
  
- **Privacy control:**
  - Creator can mark individual posts as "Supporters Only" or "Public"
  - Builds community of invested supporters who see the behind-the-scenes work

### 3. Discussions
**Purpose:** Community engagement and feedback

- **Threaded discussions under project:**
  - Not flat comments, but nested discussion threads
  - Anyone can view discussions
  - **Only supporters and the creator can start new discussions**
  - Non-supporters can still comment on existing discussions
  - Upvoting/liking on comments

### 4. Support Tiers
**Purpose:** Monetize and build community around projects

Three tiers:

1. **Hype Supporter** (Free)
   - Can start discussions (after this tier)
   - Shows up as "Hype Supporter" on project
   - Access to all public content

2. **Early Access Supporter** ($5/month or one-time)
   - All Hype Supporter benefits +
   - Early access to new versions (1 week before public)
   - Access to supporter-exclusive journey posts
   - Shows up as "Early Access Supporter" on project

3. **Champion Supporter** ($15/month or one-time)
   - All Early Access Supporter benefits +
   - Direct messaging with creator (optional—creator enables/disables)
   - Featured badge on project page
   - Shows up as "Champion Supporter" on project

**Implementation:**
- Razorpay integration for recurring or one-time payments
- Supporters list visible on project (with tier badges)

### 5. Creator Profile / Portfolio
**Purpose:** Showcase creator's journey and expertise

- **Profile displays:**
  - Creator name, bio, avatar
  - All published projects (with latest version info)
  - Total support received (monthly or total)
  - Supporter count
  - AI tools preference (e.g., "Most used: Claude Code, TypeScript")
  - Journey posts timeline
  - Social links (GitHub, Twitter, etc.)

### 6. Discovery & Browsing
**Purpose:** Help users find relevant projects

- **Filter/sort by:**
  - AI tool tags (Claude Code, Cursor, etc.)
  - Tech stack (JavaScript, Python, Go, etc.)
  - Trending (by upvotes/discussions in last week)
  - New (recently published)
  - Supporter count (most supported)
  - Creator profile link

- **Homepage feed:**
  - Trending projects
  - New projects
  - Projects from followed creators
  - Latest journey posts from supported projects

### 7. Notifications
**Purpose:** Keep users engaged

- Creator publishes new journey post
- New version released for project they support
- Someone replies to their discussion
- Someone starts a new discussion on their project (creators)

---

## User Roles & Permissions

| Action | Public User | Supporter | Creator |
|--------|-------------|-----------|---------|
| View projects | ✅ | ✅ | ✅ |
| Comment on discussions | ✅ | ✅ | ✅ |
| Start new discussions | ❌ | ✅ | ✅ |
| Create project | ❌ | ✅ | ✅ |
| Access supporter-exclusive posts | ❌ | ✅ | ✅ (own) |
| Early access to versions | ❌ | ✅ (paid) | ✅ (own) |
| See release notes | ✅ | ✅ | ✅ |
| Message creator | ❌ | ❌ (unless Champion) | ✅ |

---

## Data Model (Prisma Schema)

```prisma
model User {
  id            String @id @default(cuid())
  email         String @unique
  name          String?
  bio           String?
  avatar        String?
  createdAt     DateTime @default(now())
  
  projects      Project[]
  journeyPosts  JourneyPost[]
  discussions   Discussion[]
  comments      Comment[]
  supporters    Supporter[]
  supportedBy   Supporter[] @relation("supporter")
}

model Project {
  id            String @id @default(cuid())
  title         String
  description   String
  demoUrl       String?
  repoUrl       String
  techStack     String[] // ["Next.js", "TypeScript", etc.]
  aiToolTags    String[] // ["Claude Code", "Cursor", etc.]
  creator       User @relation(fields: [creatorId], references: [id])
  creatorId     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  versions      Version[]
  journeyPosts  JourneyPost[]
  discussions   Discussion[]
  supporters    Supporter[]
  upvotes       Int @default(0)
}

model Version {
  id            String @id @default(cuid())
  versionNumber String // "v1", "v2", etc.
  project       Project @relation(fields: [projectId], references: [id])
  projectId     String
  releaseNotes  String? // Auto-pulled from README
  isPublic      Boolean @default(true)
  releasedAt    DateTime @default(now())
}

model JourneyPost {
  id            String @id @default(cuid())
  content       String
  creator       User @relation(fields: [creatorId], references: [id])
  creatorId     String
  project       Project @relation(fields: [projectId], references: [id])
  projectId     String
  isPublic      Boolean @default(true) // false = supporters-only
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Discussion {
  id            String @id @default(cuid())
  title         String
  content       String
  project       Project @relation(fields: [projectId], references: [id])
  projectId     String
  author        User @relation(fields: [authorId], references: [id])
  authorId      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  comments      Comment[]
  upvotes       Int @default(0)
}

model Comment {
  id            String @id @default(cuid())
  content       String
  author        User @relation(fields: [authorId], references: [id])
  authorId      String
  discussion    Discussion @relation(fields: [discussionId], references: [id])
  discussionId  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  upvotes       Int @default(0)
}

model Supporter {
  id            String @id @default(cuid())
  supporter     User @relation("supporter", fields: [supporterId], references: [id])
  supporterId   String
  creator       User @relation(fields: [creatorId], references: [id])
  creatorId     String
  project       Project @relation(fields: [projectId], references: [id])
  projectId     String
  tier          String // "hype", "early-access", "champion"
  startDate     DateTime @default(now())
  endDate       DateTime? // For subscription expiry
  amountPaid    Int? // In cents (for one-time or monthly)
  isActive      Boolean @default(true)
  
  @@unique([supporterId, projectId])
}

model Transaction {
  id            String @id @default(cuid())
  supporter     Supporter @relation(fields: [supporterId], references: [id])
  supporterId   String
  amount        Int // In cents
  tier          String
  paymentType   String // "one-time" or "subscription"
  razorpayId    String @unique
  status        String // "completed", "failed", "pending"
  createdAt     DateTime @default(now())
}
```

---

## What We're NOT Building (MVP Scope)

- ❌ Startup registration / company profiles
- ❌ Product marketplace / e-commerce
- ❌ Investor tools / investment tracking
- ❌ Order management / shipping
- ❌ Hacker News API integration
- ❌ Meeting scheduling

---

## Success Metrics (Phase 1)

1. **Creator Activation:** Creators upload first project
2. **Community Engagement:** Discussions/comments per project
3. **Supporter Conversion:** % of visitors who become supporters
4. **Retention:** Journey posts published per creator per month
5. **Network Effects:** Trending tags / discovery friction

---

## Next Steps

1. ✅ Finalize product spec (this document)
2. 🔄 Update Prisma schema
3. 🔄 Design UI/UX flows (creator journey, project page, supporter view)
4. 🔄 API endpoints design
5. 🔄 Begin implementation
