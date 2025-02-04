import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { Check, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ActiveTaskButton() {
    const [activeTasks, setActiveTasks] = useState([]);
    const navigate = useNavigate();

    const fetchActiveTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            const tasks = response.data?.data || [];
            setActiveTasks(tasks.filter((task) => !task.completedTask));
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Could not fetch tasks");
            setActiveTasks([]);
        }
    };

    useEffect(() => {
        fetchActiveTasks();
    }, []);

    const handleDelete = async (taskId) => {
        try {
            await axiosInstance.post(`/deleteTask/${taskId}`);
            setActiveTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            toast.success("task deleted successfully");
        } catch (error) {
            console.error("Failed to delete task: ", error);
            toast.error("Could not delete task. Please try again.");
        }
    };

    const handleCompletedTask = async (taskId) => {
        try {
            await axiosInstance.post(`/toggleTask/${taskId}`);
            setActiveTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            toast.success("completed task");
        } catch (error) {
            console.error("Failed to update task completion status: ", error);
            toast.error("Could not update task status");
        }
    };

    return (
        <div className='min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-10 md:pt-14 lg:pt-20'>
            <div className='text-white max-w-xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold'>Active Tasks</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className='px-4 py-2 border border-white rounded-lg hover:bg-blue-500 transition-colors'
                    >
                        Back to All Tasks
                    </button>
                </div>

                {activeTasks.length > 0 ? (
                    <ul className="space-y-2">
                        {activeTasks.map((task) => (
                            <li
                                key={task._id}
                                className='p-4 rounded-xl bg-gray-800 flex items-center justify-between'
                            >
                                <span>{task.text}</span>
                                <div className='flex justify-center items-center gap-2'>
                                    <Check 
                                        size={35} 
                                        color="green"
                                        className='p-2 cursor-pointer hover:bg-green-50 rounded-xl transition-colors'
                                        onClick={() => handleCompletedTask(task._id)}
                                    />
                                    <Trash
                                        size={35}
                                        color="red"
                                        className='p-2 cursor-pointer hover:bg-red-50 rounded-xl transition-colors'
                                        onClick={() => handleDelete(task._id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No active tasks found</p>
                )}
            </div>
        </div>
    );
}

export default ActiveTaskButton