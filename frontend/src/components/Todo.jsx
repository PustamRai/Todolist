import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../api/axiosInstance';
import { Check, Home, Trash } from "lucide-react";

function Todo() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            const ourTasks = response.data?.data || []; // Use fallback to avoid undefined
            setTasks(ourTasks); // Set tasks safely
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            setTasks([]);
        }
    };


    // Run getTasks when our app first starts
    useEffect(() => {
        fetchTasks();
    }, []);

    // add a new task
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the input is not empty (after removing spaces from start/end)
        const cleanInput = inputValue.trim();
        if (cleanInput !== "") {
            try {
                // Send the task text to the server
                const response = await axiosInstance.post('/addTask', {
                    text: cleanInput
                });

                // Add the new task to our list of tasks
                const newTask = response.data.data;
                setTasks(oldTasks => [...oldTasks, newTask]);
                setInputValue('');
            } catch (error) {
                console.error("Failed to add task:", error);
            }
        }
    }

    // delete a task
    const handleDelete = async (task) => {
        try {
            const deleteTask = await axiosInstance.post(`/deleteTask/${task}`)
            console.log("deleteTask: ", deleteTask)
        } catch (error) {
            console.log("Failed to delete task: ", error);
        }
    }

    return (
        <div className='min-h-screen pt-20 bg-black'>
            <div className='flex justify-center items-center flex-col text-white'>
                <h2 className='text-3xl mb-4'>Todolist</h2>
                <form
                    onSubmit={handleSubmit}
                    className='border border-grey-500 p-3 bg-gray-400 rounded-2xl w-full max-w-md flex items-center'
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Enter your task...'
                        className='flex-grow p-2 bg-gray-400 outline-none pl-2 mr-2'
                    />
                    <button
                        type='submit'
                        className='px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 whitespace-nowrap'
                    >
                        Add
                    </button>
                </form>
            </div>

            <div className='text-white p-4 max-w-2xl mx-auto'>
                {tasks?.length > 0 ? (
                    <ul className="space-y-2">
                        {tasks.map((task, index) => (
                            <li
                                key={index}
                                className="p-6 bg-gray-800 rounded-lg text-base flex items-center justify-between"
                            >
                                <span>{task.text}</span>

                                <div className='flex justify-center items-center gap-2'>
                                    <Check size={35}
                                        color="green"
                                        className='p-2 cursor-pointer hover:bg-green-300 rounded-xl transition-colors'
                                    />

                                    <Home
                                        size={35}
                                        color="yellow"
                                        className='p-2 cursor-pointer hover:bg-yellow-300 rounded-xl transition-colors'
                                    />
                                    <Trash
                                        size={35}
                                        color="red"
                                        className='p-2 cursor-pointer hover:bg-red-300 rounded-xl transition-colors'
                                        onClick={() => handleDelete(task._id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No tasks yet. Add one!</p>
                )}
            </div>
        </div>
    );
}

export default Todo