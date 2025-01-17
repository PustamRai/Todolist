import { Task } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addTask = async (req, res) => {
        const  { text } = req.body
    
        if(!text || typeof text !== "string" || text.trim() === "") {
            throw new ApiError(400, "the 'text' field is required and must not be empty")
        }
    
        const newTask = await Task.create({
            text: text
        })
    
        if(!newTask) {
            throw new ApiError(400, "Failed to add task to the database")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newTask,
                "New task successfully added"
            )
        );
}

export { addTask }