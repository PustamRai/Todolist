import { Router } from "express"
import { addTask } from "../controllers/todo.controller.js";

const router = Router();

router.route("/addTask").post(addTask)

export default router