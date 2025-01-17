import { Task } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addTask = async (req, res) => {
        try {
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
        } catch (error) {
            throw new ApiError(400, "Error adding task: ", error)
        }
}

const updateTask = async (req, res) => {
    try {
        const { _id, text } = req.body
    
        if(!_id && !text) {
            throw new ApiError(400, "id and text field is required")
        }
    
        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            {
                $set: {
                    text
                }
            },
            {
                new: true // return the updated document
            }
        )

        if (!updatedTask) {
            throw new ApiError(404, "Task not found");
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTask,
                "task updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(400, "Error updating task: ", error)
    }

}

const deleteTask = async (req, res) => {
    const { _id } = req.body

    if(!_id) {
        throw new ApiError(400, "id not found")
    }

    const deletedTask = await Task.findByIdAndDelete( _id )

    if(!deletedTask) {
        throw new ApiError(400, "task not deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedTask,
            "task deleted successfully"
        )
    )
}

export { 
    addTask,
    updateTask,
    deleteTask
}