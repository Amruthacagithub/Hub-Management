const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["OEM Technician", "Blive Technician", "TUT", "Hub Ops"], 
        required: true 
    },
    permissions: { type: [String], default: [] } // List of permissions like "Create Task", "Assign Task", etc.
});

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
