import { Task } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
        
        return res.status(200).json(
            new ApiResponse(
                200,
                tasks,
                "Tasks fetched successfully"
            )
        )
    } catch (error) {
        console.log("Tasks doesnot fetched: ", error);
    }
}

const addTask = async (req, res) => {
        try {
            const  { text } = req.body
        
            if(!text?.trim()) {
                throw new ApiError(400, "the 'text' field is required and must not be empty")
            }
        
            const newTask = await Task.create({
                text: text
            })
        
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
        const { _id } = req.params
        const { text } = req.body
    
        if(!_id || !text) {
            throw new ApiError(400, "_id and text field is required")
        }

        const trimmedText = text.trim()
        if(!trimmedText) {
            throw new ApiError(400, "text field must not be empty")
        }
    
        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            {
                $set: {
                    text: trimmedText
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
    const { _id } = req.params

    if(!_id) {
        throw new ApiError(400, "ID not found")
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

const toggleTaskCompletion = async (req, res) => {
    try {
        const { _id } = req.params;
    
        if(!_id) {
            throw new ApiError("Id not found for task completion");
        }
    
        // Find the task and get its current completion status
        const task = await Task.findById(_id)
    
        if(!task) {
            throw new ApiError("task not found for task completion");
        }
    
        const updateTask = await Task.findByIdAndUpdate(
            _id,
            {
                $set: {
                    completedTask: !task.completedTask
                }
            },
            {
                new: true
            }
        )
    
        if(!updateTask) {
            throw new ApiError("task completion not updated");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateTask,
                `Task mark as ${updateTask.completedTask ? "completed" : "incomplete"}`
            )
        )
    } catch (error) {
        throw new ApiError(400, "Error updating task completion status: ", error);
    }
}

export { 
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
}