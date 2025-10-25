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