import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../api/axiosInstance';
import { Check, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";


function Todo() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            const ourTasks = response.data?.data || []; // Use fallback to avoid undefined
            setTasks(ourTasks); // Set tasks safely
            toast.success("task fetched successfully")
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Could not fetch tasks")
            setTasks([]);
        }
    };


    // Run getTasks when our app first starts
    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputValue.trim()) {
            toast.error("Task cannot be empty");
            return;
        }

        const cleanInput = inputValue.trim();

        try {
            // update
            if (editingTaskId) {
                await axiosInstance.post(`/updateTask/${editingTaskId}`, {
                    text: cleanInput
                })
                setEditingTaskId(null);
                setInputValue("");
                await fetchTasks();
                toast.success("task updated successfully");
            } else {
                // add
                const response = await axiosInstance.post('/addTask', {
                    text: cleanInput
                });
                const newTask = response.data.data;
                setTasks(oldTasks => [...oldTasks, newTask]);
                setInputValue("");
                await fetchTasks();
                toast.success("task added successfully")
            }
        } catch (error) {
            console.error("Failed to save task: ", error);
            toast.error(editingTaskId
                ? "Failed to update task. Please try again."
                : "Failed to save task. Please try again."
            )
        }
    }

    // editing task
    const handleEdit = (task) => {
        setInputValue(task.text) // Put current task text in input field
        setEditingTaskId(task._id) // Mark this task as being edited
    }

    // cancel editing
    const handleCancelEdit = () => {
        setInputValue('');
        setEditingTaskId(null);
    }

    // delete a task
    const handleDelete = async (taskId) => {
        try {
            await axiosInstance.post(`/deleteTask/${taskId}`);
            setTasks(tasks.filter((task) => task._id !== taskId));  // Update the task list
            toast.success("task deleted successfully")
        } catch (error) {
            console.log("Failed to delete task: ", error);
            toast.error("Could not delete task. Please try again.")
        }
    }

    // completed task
    const handleCompletedTask = () => {

    }

    return (
        <div className='min-h-screen pt-20 bg-black'>
            <div className='flex justify-center items-center flex-col text-white'>
                <h2 className='text-3xl font-bold font-serif mb-4'>Todo App</h2>
                <form
                    onSubmit={handleSubmit}
                    className='p-3 bg-black rounded-2xl w-full max-w-xl flex items-center gap-2'
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Enter your task'
                        className='w-full p-4 bg-gray-900 border border-gray-700 
                        focus:border-blue-500 focus:outline-none rounded-xl
                        transition-all duration-75 ease-in-out'
                    />
                    <div className="flex gap-2">
                        <button
                            type='submit'
                            className='p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 whitespace-nowrap'
                        >
                            {editingTaskId ? "Update task" : "Add Task"}
                        </button>

                        {editingTaskId && (
                            <button
                                type='button'
                                onClick={handleCancelEdit}
                                className='px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 whitespace-nowrap'
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className='text-white p-4 max-w-xl mx-auto'>
                {tasks?.length > 0 ? (
                    <ul className="space-y-2">
                        {tasks.map((task, index) =>
                            <li
                                key={index}
                                className={`p-4 rounded-xl transition-all duration-100 ease-in flex items-center justify-between
                                    ${editingTaskId === task._id
                                        ? 'bg-gray-700 border-2 border-yellow-500'
                                        : 'bg-gray-800'
                                    }`}
                            >
                                <span>{task.text}</span>

                                <div className='flex justify-center items-center gap-2'>
                                    <Check size={35}
                                        color="green"
                                        className='p-2 cursor-pointer hover:bg-green-50 rounded-xl transition-colors'
                                        onClick={handleCompletedTask}
                                    />

                                    <Edit
                                        size={35}
                                        color="orange"
                                        className='p-2 cursor-pointer hover:bg-orange-50 rounded-xl transition-colors'
                                        onClick={() => handleEdit(task)}
                                    />
                                    <Trash
                                        size={35}
                                        color="red"
                                        className='p-2 cursor-pointer hover:bg-red-50 rounded-xl transition-colors'
                                        onClick={() => handleDelete(task._id)}
                                    />
                                </div>
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No tasks yet. Add one!</p>
                )}
            </div>
        </div>
    );
}

export default Todo