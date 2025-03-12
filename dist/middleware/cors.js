"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://Intership-2025.vercel.app',
        'https://your-app-name.railway.app' // Thay bằng domain Railway của bạn
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
