import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../api/axiosInstance';
import { Check, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Todo() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const navigate = useNavigate();

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');
            const ourTasks = response.data?.data || []; // Use fallback to avoid undefined

            // Separate tasks based on completion status
            setActiveTasks(ourTasks.filter((task) => !task.completedTask));
            setCompletedTasks(ourTasks.filter((task) => task.completedTask))
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Could not fetch tasks")
            setActiveTasks([]);
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
                setActiveTasks(oldTasks => [...oldTasks, newTask]);
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
    const handleDelete = async (taskId, isCompleted) => {
        try {
            // await axiosInstance.post(`/deleteTask/${taskId}`);
            // setActiveTasks(activeTasks.filter((task) => task._id !== taskId));  // Update the task list

            await axiosInstance.post(`/deleteTask/${taskId}`);

            if (isCompleted) {
                setCompletedTasks(prevTasks =>
                    prevTasks.filter(task => task._id !== taskId)
                )
            } else {
                setActiveTasks(prevTasks =>
                    prevTasks.filter(task => task._id !== taskId)
                )
            }
            toast.success("task deleted successfully")
        } catch (error) {
            console.log("Failed to delete task: ", error);
            toast.error("Could not delete task. Please try again.")
        }
    }

    // completed task
    const handleCompletedTask = async (taskId) => {
        try {
            const response = await axiosInstance.post(`/toggleTask/${taskId}`)
            const updatedTask = response.data.data

            // remove task from active task
            setActiveTasks(prevTasks =>
                prevTasks.filter(task => task._id !== taskId)
            )

            // Add it to completed tasks with the updated status
            setCompletedTasks(prevTasks => [...prevTasks, updatedTask]
            )
            await fetchTasks();
            toast.success("completed task")
        } catch (error) {
            console.log("Failed to update task completion status: ", error);
            toast.error("Could not update task status")
        }
    }

    return (
        <div className='h-screen bg-black
            px-4 sm:px-6 md:px-8 lg:px-12 
            pt-6 sm:pt-10 md:pt-14 lg:pt-20
            relaive overflow-auto
        '>
            <div className='flex justify-center items-center flex-col text-white 
                w-full 
                max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                mx-auto
            '>
                <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold font-serif mb-4'>Todo App</h2>
                <form
                    onSubmit={handleSubmit}
                    className=' 
                        p-3 bg-black rounded-2xl w-full 
                        flex flex-col sm:flex-row 
                        items-center gap-2
                '>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='add your task'
                        className='
                        w-full 
                        p-3 sm:p-3 md:p-4 
                        bg-gray-900 
                        border border-gray-700 
                        focus:border-blue-500 
                        focus:outline-none 
                        rounded-xl 
                        transition-all 
                        duration-200 
                        text-sm sm:text-base
                    '
                    />
                    <div className="
                        flex flex-col sm:flex-row 
                        w-full sm:w-auto 
                        gap-3
                    ">
                        <button
                            type='submit'
                            className='
                                p-3 md:p-4
                                bg-blue-500 
                                text-white 
                                rounded-xl font-bold
                                hover:bg-blue-700 
                                w-full sm:w-auto
                                transition-colors
                                text-sm sm:text-base
                            '
                        >
                            {editingTaskId ? "Update " : "Add "}
                        </button>

                        {editingTaskId && (
                            <button
                                type='button'
                                onClick={handleCancelEdit}
                                className='
                                    p-3 
                                    bg-gray-500 
                                    text-white 
                                    rounded-xl font-bold
                                    hover:bg-gray-600 
                                    w-full sm:w-auto
                                    transition-colors
                                    text-sm sm:text-base
                                '
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* active tasks section */}
            <div className='
                text-white p-4 
                w-full 
                max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                mx-auto
            '>
                {activeTasks?.length > 0 ? (
                    <ul className="space-y-2">
                        {activeTasks.map((task, index) =>
                            <li
                                key={index}
                                className={`p-4 rounded-xl hover:bg-gray-700 transition-all duration-100 ease-in flex items-center justify-between
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
                                        onClick={() => handleCompletedTask(task._id)}
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
                                        onClick={() => handleDelete(task._id, false)}
                                    />
                                </div>
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No tasks yet. Add one!</p>
                )}
            </div>

            {/* completed tasks section */}
            <div className='
                my-6 sm:my-8 md:my-10 
                text-white p-4 
                w-full 
                max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                mx-auto 
            '>
                {completedTasks?.length > 0 && (
                    <div className="space-y-2">
                        <hr />
                        <h2 className="
                            m-2 
                            text-lg sm:text-xl md:text-2xl 
                            font-bold text-center 
                            text-green-500
                        ">
                            Completed Tasks
                        </h2>
                        {completedTasks.map((task) => (
                            <li
                                key={task._id}
                                className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-100 ease-in flex items-center justify-between opacity-60"
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
                            </li>
                        ))}
                    </div>
                )}
            </div>

            <div className='p-4 rounded-xl flex justify-center items-center gap-3 absolute bottom-0 left-0 right-0 
            '>
                <button
                    className='
                        p-3 
                        bg-orange-500 
                        text-white 
                        rounded-xl font-bold
                        hover:bg-orange-400 
                        w-full sm:w-auto
                        transition-colors
                        text-sm sm:text-base'
                    onClick={() => navigate("/activeTasks")}
                >
                    Active Task
                </button>

                <button
                    className='
                        p-3 
                        bg-orange-500 
                        text-white 
                        rounded-xl font-bold
                        hover:bg-orange-400 
                        w-full sm:w-auto
                        transition-colors
                        text-sm sm:text-base'
                    onClick={() => navigate("/completedTasks")}
                >
                    Completed Task
                </button>
            </div>
        </div>
    ); 1
}

export default Todo