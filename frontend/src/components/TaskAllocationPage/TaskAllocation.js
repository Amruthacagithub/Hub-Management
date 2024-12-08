import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskAllocation.css";

const TaskAllocation = () => {
    const [tasks, setTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
    });
    const [filter, setFilter] = useState("");

    // Fetch tasks and team members
    useEffect(() => {
        axios.get("http://localhost:5000/api/tasks")
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));

        axios.get("http://localhost:5000/api/team-members")
            .then(response => setTeamMembers(response.data))
            .catch(error => console.error("Error fetching team members:", error));
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Create a new task
    const handleAddTask = () => {
        axios.post("http://localhost:5000/api/tasks", newTask)
            .then(response => {
                setTasks([response.data, ...tasks]);
                setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
            })
            .catch(error => console.error("Error adding task:", error));
    };

    // Filter tasks by team member
    const filteredTasks = tasks.filter(task => 
        filter === "" || (task.assignedTo && task.assignedTo.name === filter)
    );

    return (
        <div className="task-allocation-container">
            <h2>Task Allocation</h2>
            <div className="task-form">
                <h3>Create New Task</h3>
                <input 
                    type="text" 
                    name="title" 
                    value={newTask.title} 
                    onChange={handleInputChange} 
                    placeholder="Task Title" 
                />
                <textarea 
                    name="description" 
                    value={newTask.description} 
                    onChange={handleInputChange} 
                    placeholder="Task Description" 
                />
                <select name="assignedTo" value={newTask.assignedTo} onChange={handleInputChange}>
                    <option value="">Assign To</option>
                    {teamMembers.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.name} - {member.role}
                        </option>
                    ))}
                </select>
                <input 
                    type="date" 
                    name="dueDate" 
                    value={newTask.dueDate} 
                    onChange={handleInputChange} 
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <div className="task-list">
                <h3>Task List</h3>
                <select onChange={(e) => setFilter(e.target.value)}>
                    <option value="">Filter by Team Member</option>
                    {teamMembers.map(member => (
                        <option key={member._id} value={member.name}>
                            {member.name}
                        </option>
                    ))}
                </select>
                <ul>
                    {filteredTasks.map(task => (
                        <li key={task._id}>
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <p><strong>Assigned To:</strong> {task.assignedTo?.name || "Unassigned"}</p>
                            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                            <progress value={task.progress} max="100"></progress>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskAllocation;
