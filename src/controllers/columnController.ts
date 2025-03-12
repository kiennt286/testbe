import { db } from "../db/drizzle";
import { columns } from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export const getColumns = async (_: Request, res: Response) => {
  try {
    const allColumns = await db.select().from(columns).orderBy(columns.order);
    if (allColumns.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No columns found" });
    }
    res.status(200).json({ success: true, data: allColumns, message: "Columns retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getColumnById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const columnId = Number(id);
    if (isNaN(columnId) || columnId <= 0) {
      return res.status(400).json({ success: false, error: "Invalid column ID" });
    }
    const [column] = await db.select().from(columns).where(eq(columns.id, columnId));
    if (!column) {
      return res.status(404).json({ success: false, error: "Column not found" });
    }
    res.status(200).json({ success: true, data: column, message: "Column retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateColumnOrder = async (req: Request, res: Response) => {
  try {
    const { columns: updatedColumns } = req.body;
    if (!Array.isArray(updatedColumns) || updatedColumns.length !== 3) {
      return res.status(400).json({ success: false, error: "Exactly 3 columns are required" });
    }
    await db.transaction(async (tx) => {
      for (const col of updatedColumns) {
        if (!col.id || col.order === undefined || typeof col.order !== "number") {
          throw new Error("Each column must have a valid id and order (number)");
        }
        const [existingColumn] = await tx.select().from(columns).where(eq(columns.id, col.id));
        if (!existingColumn) {
          throw new Error(`Column with id ${col.id} not found`);
        }
        await tx.update(columns).set({ order: col.order }).where(eq(columns.id, col.id));
      }
    });
    const updatedData = await db.select().from(columns).orderBy(columns.order);
    res.status(200).json({ success: true, data: updatedData, message: "Column order updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};