import { db } from "../db/drizzle";
import { tasks, columns } from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export const getTasks = async (_: Request, res: Response) => {
  try {
    const allTasks = await db.select().from(tasks).orderBy(tasks.order);
    if (allTasks.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No tasks found" });
    }
    res.status(200).json({ success: true, data: allTasks, message: "Tasks retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId } = req.body;

    // Validation - description bắt buộc
    if (!title || !description || !columnId) {
      return res.status(400).json({ success: false, error: "Title, description, and columnId are required" });
    }

    // Kiểm tra columnId tồn tại
    const [column] = await db.select().from(columns).where(eq(columns.id, columnId));
    if (!column) {
      return res.status(400).json({ success: false, error: "Invalid columnId" });
    }

    // Tính order mới (lớn nhất trong cột + 1)
    const maxOrder = await db.select({ max: tasks.order })
      .from(tasks)
      .where(eq(tasks.columnId, columnId))
      .then(res => res[0]?.max || 0);

    const result = await db.insert(tasks).values({ 
      title, 
      description, 
      columnId, 
      order: maxOrder + 1 
    });
    const taskId = result[0].insertId;

    const [newTask] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    res.status(201).json({ success: true, data: newTask, message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
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

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!existingTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    const [column] = await db.select().from(columns).where(eq(columns.id, columnId));
    if (!column) {
      return res.status(400).json({ success: false, error: "Invalid columnId" });
    }

    await db.update(tasks)
      .set({ title, description, columnId, order })
      .where(eq(tasks.id, taskId));

    const [updatedTask] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    res.status(200).json({ success: true, data: updatedTask, message: "Task updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskId = Number(id);

    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (!existingTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));
    res.status(200).json({ success: true, data: existingTask, message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};