import { pgTable, serial, integer, text, timestamp, uuid, varchar, boolean, index } from "drizzle-orm/pg-core"

export const UserTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
})

export const StatusesTable = pgTable("statuses", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255}).notNull(),
    userId: uuid("user_id").references(() => UserTable.id).notNull()
})

export const ToDoTable = pgTable("todos", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => UserTable.id).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    statusId: integer("status_id").references(() => StatusesTable.id),
    createdAt: timestamp("createdAt").defaultNow().notNull()
})

export const SessionTable = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => UserTable.id).notNull(),
    refreshToken: text("refresh_token").notNull().unique(),
    revoked: boolean("revoked").default(false).notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull()
}, (table) => ({
    refreshTokenIdx: index("refresh_token_idx").on(table.refreshToken),
    userIdIdx: index("user_id_idx").on(table.userId),
}))

export const WorkspacesTable = pgTable("workspaces", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    ownerId: uuid("owner_id").references(() => UserTable.id).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
})

export const WorkSpaceRolesTable = pgTable("workspace_roles", {
    id: serial("id").primaryKey(),
    workspaceId: uuid("workspace_id").references(() => WorkspacesTable.id).notNull(),
    roleName: varchar("role_name", { length: 50 }).notNull(),
    permissions: text("permissions").notNull()
})

export const WorkspaceMembersTable = pgTable("workspace_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").references(() => WorkspacesTable.id).notNull(),
    userId: uuid("user_id").references(() => UserTable.id).notNull(),
    roleId: integer("role_id").references(() => WorkSpaceRolesTable.id).notNull(),
    joinedAt: timestamp("joinedAt").defaultNow().notNull()
})

export const InvitationsTable = pgTable("invitations", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").references(() => WorkspacesTable.id).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    roleId: integer("role_id").references(() => WorkSpaceRolesTable.id).notNull(),
    invitedAt: timestamp("invitedAt").defaultNow().notNull(),
    updatedAt: timestamp("acceptedAt"),
    status: varchar("status", { length: 255 }).notNull().default("pending")
})