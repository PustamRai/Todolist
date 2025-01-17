import { Router } from "express"
import { 
    addTask,
    updateTask,
    deleteTask
} from "../controllers/todo.controller.js";

const router = Router();

router.route("/addTask").post(addTask)
router.route("/updateTask").post(updateTask)
router.route("/deleteTask").post(deleteTask)

export default router