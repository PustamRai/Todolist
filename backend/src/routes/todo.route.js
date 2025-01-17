import { Router } from "express"
import { 
    addTask,
    updateTask
} from "../controllers/todo.controller.js";

const router = Router();

router.route("/addTask").post(addTask)
router.route("/updateTask").post(updateTask)

export default router