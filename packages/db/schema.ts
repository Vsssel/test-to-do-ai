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
    title: varchar("title", { length: 255}).notNull()
})

export const ToDoTable = pgTable("to-do", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => UserTable.id),
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
