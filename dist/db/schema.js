"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = exports.columns = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.columns = (0, mysql_core_1.mysqlTable)("columns", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    order: (0, mysql_core_1.int)("order").notNull().default(0),
});
exports.tasks = (0, mysql_core_1.mysqlTable)("tasks", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, mysql_core_1.varchar)("description", { length: 500 }).notNull(),
    columnId: (0, mysql_core_1.int)("columnId").notNull().references(() => exports.columns.id, { onDelete: "cascade" }),
    order: (0, mysql_core_1.int)("order").notNull().default(0),
});
