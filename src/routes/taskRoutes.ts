import { Router, Request, Response } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await getTasks(req, res);
});

router.post("/", async (req: Request, res: Response) => {
  await createTask(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await updateTask(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await deleteTask(req, res);
});

export default router;
