import { Router } from "express"
import { 
    getTasks,
    addTask,
    updateTask,
    deleteTask,
} from "../controllers/todo.controller.js";

const router = Router();

router.route("/tasks").get(getTasks)
router.route("/addTask").post(addTask)
router.route("/updateTask").post(updateTask)
router.route("/deleteTask/:_id").post(deleteTask)

export default router