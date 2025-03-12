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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const columnRoutes_1 = __importDefault(require("./routes/columnRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = require("./middleware/cors");
const drizzle_1 = require("./db/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json());
// 🟢 Test API endpoint
app.get("/", (req, res) => {
    res.json({
        message: "API is working!",
        timestamp: new Date().toISOString()
    });
});
// 🟢 Test database connection
app.get("/test-db", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield drizzle_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        res.json({
            message: "Database connection successful!",
            result
        });
    }
    catch (error) {
        console.error("Database connection error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            message: "Database connection failed!",
            error: errorMessage
        });
    }
}));
// 🟢 API Routes
app.use("/tasks", taskRoutes_1.default);
app.use("/columns", columnRoutes_1.default);
// 🛑 Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
