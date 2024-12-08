const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const TeamMember = require("../models/TeamMember");

// Create a new task
router.post("/tasks", async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all tasks with assigned team member details
router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task (assign, progress, status, etc.)
router.put("/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all team members
router.get("/team-members", async (req, res) => {
    try {
        const members = await TeamMember.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new team member
router.post("/team-members", async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
