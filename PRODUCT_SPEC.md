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

2. **Early Access Supporter** ($5 one-time)
   - All Hype Supporter benefits +
   - Early access to new versions (1 week before public)
   - Access to supporter-exclusive journey posts
   - Shows up as "Early Access Supporter" on project

3. **Champion Supporter** ($15 one-time)
   - All Early Access Supporter benefits +
   - Direct messaging with creator (optional—creator enables/disables)
   - Featured badge on project page
   - Shows up as "Champion Supporter" on project

**Implementation:**
- Razorpay integration for one-time payments
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

## Data Model (Drizzle ORM Schema)

```typescript
import { pgTable, text, integer, boolean, timestamp, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  bio: text('bio'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  demoUrl: text('demo_url'),
  repoUrl: text('repo_url').notNull(),
  techStack: jsonb('tech_stack').default('[]').notNull(), // ["Next.js", "TypeScript"]
  aiToolTags: jsonb('ai_tool_tags').default('[]').notNull(), // ["Claude Code", "Cursor"]
  creatorId: text('creator_id').notNull().references(() => users.id),
  upvotes: integer('upvotes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Versions table
export const versions = pgTable('versions', {
  id: text('id').primaryKey(),
  versionNumber: text('version_number').notNull(), // "v1", "v2", etc.
  projectId: text('project_id').notNull().references(() => projects.id),
  releaseNotes: text('release_notes'), // Auto-pulled from README
  isPublic: boolean('is_public').default(true).notNull(),
  releasedAt: timestamp('released_at').defaultNow().notNull(),
});

// Journey Posts table
export const journeyPosts = pgTable('journey_posts', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  projectId: text('project_id').notNull().references(() => projects.id),
  isPublic: boolean('is_public').default(true).notNull(), // false = supporters-only
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Discussions table
export const discussions = pgTable('discussions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  projectId: text('project_id').notNull().references(() => projects.id),
  authorId: text('author_id').notNull().references(() => users.id),
  upvotes: integer('upvotes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comments table
export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  discussionId: text('discussion_id').notNull().references(() => discussions.id),
  upvotes: integer('upvotes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Supporters table
export const supporters = pgTable('supporters', {
  id: text('id').primaryKey(),
  supporterId: text('supporter_id').notNull().references(() => users.id),
  creatorId: text('creator_id').notNull().references(() => users.id),
  projectId: text('project_id').notNull().references(() => projects.id),
  tier: text('tier').notNull(), // "hype", "early-access", "champion"
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  amountPaid: integer('amount_paid'), // In cents
  isActive: boolean('is_active').default(true).notNull(),
}, (table) => ({
  unq: uniqueIndex('supporters_unique_idx').on(table.supporterId, table.projectId),
}));

// Transactions table
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  supporterId: text('supporter_id').notNull().references(() => supporters.id),
  amount: integer('amount').notNull(), // In cents
  tier: text('tier').notNull(),
  paymentType: text('payment_type').notNull(), // "one-time"
  razorpayId: text('razorpay_id').unique().notNull(),
  status: text('status').notNull(), // "completed", "failed", "pending"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  journeyPosts: many(journeyPosts),
  discussions: many(discussions),
  comments: many(comments),
  supportedProjects: many(supporters),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, { fields: [projects.creatorId], references: [users.id] }),
  versions: many(versions),
  journeyPosts: many(journeyPosts),
  discussions: many(discussions),
  supporters: many(supporters),
}));

export const supportersRelations = relations(supporters, ({ one, many }) => ({
  supporter: one(users, { fields: [supporters.supporterId], references: [users.id] }),
  creator: one(users, { fields: [supporters.creatorId], references: [users.id] }),
  project: one(projects, { fields: [supporters.projectId], references: [projects.id] }),
  transactions: many(transactions),
}));
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
2. 🔄 Create Drizzle schema files in codebase
3. 🔄 Design UI/UX flows (creator journey, project page, supporter view)
4. 🔄 API endpoints design
5. 🔄 Begin implementation
