import React, { useState, useEffect } from 'react';
import { Check, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from '../api/axiosInstance';

function Todo() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [completedTask, setCompletedTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Fetch tasks and separate them into active and completed
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            const allTasks = response.data?.data || [];

            console.log("fetched task: ", allTasks);

            
            // Separate tasks based on completion status
            setActiveTasks(allTasks.filter(task => !task.completedTask));
            setCompletedTasks(allTasks.filter(task => task.completedTask));
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Could not fetch tasks");
            setActiveTasks([]);
            setCompletedTasks([]);
        }
    };

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
            if (editingTaskId) {
                const response = await axiosInstance.post(`/updateTask/${editingTaskId}`, {
                    text: cleanInput
                });
                const updatedTask = response.data.data;
                
                setActiveTasks(prevTasks => 
                    prevTasks.map(task => 
                        task._id === editingTaskId ? updatedTask : task
                    )
                );
                
                setEditingTaskId(null);
                setInputValue("");
                toast.success("task updated successfully");
            } else {
                const response = await axiosInstance.post('/addTask', {
                    text: cleanInput
                });
                const newTask = response.data.data;
                setActiveTasks(prevTasks => [...prevTasks, newTask]);
                setInputValue("");
                toast.success("task added successfully");
            }
        } catch (error) {
            console.error("Failed to save task: ", error);
            toast.error(editingTaskId
                ? "Failed to update task. Please try again."
                : "Failed to save task. Please try again."
            );
        }
    };

    const handleEdit = (task) => {
        setInputValue(task.text);
        setEditingTaskId(task._id);
    };

    const handleCancelEdit = () => {
        setInputValue('');
        setEditingTaskId(null);
    };

    const handleDelete = async (taskId, isCompleted) => {
        try {
            await axiosInstance.post(`/deleteTask/${taskId}`);
            
            if (isCompleted) {
                setCompletedTasks(prevTasks => 
                    prevTasks.filter(task => task._id !== taskId)
                );
            } else {
                setActiveTasks(prevTasks => 
                    prevTasks.filter(task => task._id !== taskId)
                );
            }
            
            toast.success("task deleted successfully");
        } catch (error) {
            console.error("Failed to delete task: ", error);
            toast.error("Could not delete task. Please try again.");
        }
    };

    const handleCompletedTask = async (taskId) => {
        try {
            const response = await axiosInstance.post(`/toggleTask/${taskId}`);
            const updatedTask = response.data.data;
            
            // First remove the task from active tasks
            setActiveTasks(prevTasks => 
                prevTasks.filter(task => task._id !== taskId)
            );
            
            // Add it to completed tasks with the updated status
            setCompletedTasks(prevTasks => [...prevTasks, {
                ...updatedTask,
                completedTask: true // ensure completed status is set
            }]);
            
            toast.success("Task completed successfully");
        } catch (error) {
            console.error("Failed to update task completion status:", error);
            toast.error("Could not update task status. Please try again.");
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-black">
            <div className="flex justify-center items-center flex-col text-white">
                <form
                    onSubmit={handleSubmit}
                    className="p-3 bg-black rounded-2xl w-full max-w-xl flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="add your task"
                        className="w-full p-4 bg-gray-900 border border-gray-700 
                        focus:border-blue-500 focus:outline-none rounded-xl
                        transition-all duration-75 ease-in-out"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Add
                    </button>
                </form>
            </div>

            <div className="text-white p-4 max-w-xl mx-auto space-y-8">
                {/* Active Tasks */}
                <div className="space-y-2">
                    {activeTasks.map((task) => (
                        <div
                            key={task._id}
                            className="p-4 rounded-xl bg-gray-800 flex items-center justify-between"
                        >
                            <span>{task.text}</span>
                            <div className="flex justify-center items-center gap-2">
                                <Check
                                    size={35}
                                    className="p-2 cursor-pointer hover:bg-green-50 rounded-xl transition-colors"
                                    onClick={() => handleCompletedTask(task._id)}
                                />
                                <Edit
                                    size={35}
                                    color="orange"
                                    className="p-2 cursor-pointer hover:bg-orange-50 rounded-xl transition-colors"
                                    onClick={() => handleEdit(task)}
                                />
                                <Trash
                                    size={35}
                                    color="red"
                                    className="p-2 cursor-pointer hover:bg-red-50 rounded-xl transition-colors"
                                    onClick={() => handleDelete(task._id, false)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Completed Tasks Section */}
                {completedTask.length > 0 && (
                    <div className="space-y-2">
                        <h2 className="text-xl text-green-500">completed task</h2>
                        {completedTask.map((task) => (
                            <div
                                key={task._id}
                                className="p-4 rounded-xl bg-gray-800 flex items-center justify-between opacity-60"
                            >
                                <span>{task.text}</span>
                                <div className="flex justify-center items-center">
                                    <Trash
                                        size={35}
                                        color="red"
                                        className="p-2 cursor-pointer hover:bg-red-50 rounded-xl transition-colors"
                                        onClick={() => handleDelete(task._id, true)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Todo;