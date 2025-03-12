import express, { Request, Response, NextFunction } from "express";
import taskRoutes from "./routes/taskRoutes";
import columnRoutes from "./routes/columnRoutes";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/cors";
import { db } from "./db/drizzle";
import { sql } from "drizzle-orm";

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// 🟢 Test API endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

// 🟢 Test database connection
app.get("/test-db", async (req: Request, res: Response) => {
  try {
    const result = await db.execute(sql`SELECT 1`);
    res.json({ 
      message: "Database connection successful!",
      result
    });
  } catch (error) {
    console.error("Database connection error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error"; 
    res.status(500).json({ 
      message: "Database connection failed!",
      error: errorMessage 
    });
  }
});

// 🟢 API Routes
app.use("/tasks", taskRoutes);
app.use("/columns", columnRoutes);

// 🛑 Middleware xử lý lỗi toàn cục
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  res.status(500).json({ error: errorMessage });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
