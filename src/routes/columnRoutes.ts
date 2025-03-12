import { Router, Request, Response } from "express";
import { getColumnById, getColumns,updateColumnOrder } from "../controllers/columnController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await getColumns(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await getColumnById(req, res);
});

router.put("/order", async (req: Request, res: Response) => {
  await updateColumnOrder(req, res);
});

export default router;
