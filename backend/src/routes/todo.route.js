import { Router } from "express"
import { 
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
} from "../controllers/todo.controller.js";

const router = Router();

router.route("/tasks").get(getTasks)
router.route("/addTask").post(addTask)
router.route("/updateTask/:_id").post(updateTask)
router.route("/deleteTask/:_id").post(deleteTask)
router.route("/toggleTask/:_id").post(toggleTaskCompletion)

export default router