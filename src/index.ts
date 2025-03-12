import express from "express";
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

// Test endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    // Thử query đơn giản
    const result = await db.execute(sql`SELECT 1`);
    res.json({ 
      message: "Database connection successful!",
      result
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      message: "Database connection failed!",
      error: error.message 
    });
  }
});

app.use("/tasks", taskRoutes);
app.use("/columns", columnRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
