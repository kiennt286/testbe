"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const drizzle_1 = require("../db/drizzle");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getTasks = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTasks = yield drizzle_1.db.select().from(schema_1.tasks).orderBy(schema_1.tasks.order);
        if (allTasks.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No tasks found" });
        }
        res.status(200).json({ success: true, data: allTasks, message: "Tasks retrieved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, columnId } = req.body;
        // Validation - description bắt buộc
        if (!title || !description || !columnId) {
            return res.status(400).json({ success: false, error: "Title, description, and columnId are required" });
        }
        // Kiểm tra columnId tồn tại
        const [column] = yield drizzle_1.db.select().from(schema_1.columns).where((0, drizzle_orm_1.eq)(schema_1.columns.id, columnId));
        if (!column) {
            return res.status(400).json({ success: false, error: "Invalid columnId" });
        }
        // Tính order mới (lớn nhất trong cột + 1)
        const maxOrder = yield drizzle_1.db.select({ max: schema_1.tasks.order })
            .from(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.columnId, columnId))
            .then(res => { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.max) || 0; });
        const result = yield drizzle_1.db.insert(schema_1.tasks).values({
            title,
            description,
            columnId,
            order: maxOrder + 1
        });
        const taskId = result[0].insertId;
        const [newTask] = yield drizzle_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        res.status(201).json({ success: true, data: newTask, message: "Task created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, columnId, order } = req.body;
        const taskId = Number(id);
        if (isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ success: false, error: "Invalid task ID" });
        }
        if (!title || !description || !columnId || order === undefined || typeof order !== "number") {
            return res.status(400).json({ success: false, error: "Title, description, columnId, and order (number) are required" });
        }
        const [existingTask] = yield drizzle_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        if (!existingTask) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        const [column] = yield drizzle_1.db.select().from(schema_1.columns).where((0, drizzle_orm_1.eq)(schema_1.columns.id, columnId));
        if (!column) {
            return res.status(400).json({ success: false, error: "Invalid columnId" });
        }
        yield drizzle_1.db.update(schema_1.tasks)
            .set({ title, description, columnId, order })
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        const [updatedTask] = yield drizzle_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        res.status(200).json({ success: true, data: updatedTask, message: "Task updated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const taskId = Number(id);
        if (isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ success: false, error: "Invalid task ID" });
        }
        const [existingTask] = yield drizzle_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        if (!existingTask) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        yield drizzle_1.db.delete(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
        res.status(200).json({ success: true, data: existingTask, message: "Task deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.deleteTask = deleteTask;
