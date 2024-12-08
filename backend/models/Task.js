const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    decription:{
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, ref: "TeamMember"
    },
    status: { 
        type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" 
    },
    dueDate: {
         type: Date, required: true 
        },
    progress: { 
        type: Number, default: 0 
    }, // Percentage of progress (0-100)
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);