import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../api/axiosInstance';

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

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the input is not empty (after removing spaces from start/end)
    const cleanInput = inputValue.trim();
    if(cleanInput !== "") {
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

    return (
        <div className='min-h-screen pt-20 bg-black'>
            <div className='flex justify-center items-center flex-col text-white'>
                <h2 className='text-3xl mb-4'>Todolist</h2>
                <form 
                    onSubmit={handleSubmit}
                    className='border border-grey-500 p-3 bg-gray-400 rounded-2xl md:w-2/4'
                >
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Enter your task...'
                        className='p-2 w-3/4 bg-gray-400 outline-none pl-2'
                    />
                    <button 
                        type='submit'
                        className='p-4 w-24 bg-blue-500 text-white rounded-xl ml-2 hover:bg-blue-600'
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
                                className="p-3 bg-gray-800 rounded-lg"
                            >
                                {task.text}
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