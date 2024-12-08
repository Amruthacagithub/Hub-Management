// Database Schema

const mongoose = require('mongoose');

// Possible vehicle states
const vehicleStateEnum = ['service', 'rtd', 'missing', 'deployed'];

const vehicleSchema = new mongoose.Schema({
    vehicleId:{
        type: String,
        required: true,
        unique: true,
    },
    state: {
        type: String,
        enum: vehicleStateEnum,
        required: true,
    },
    entryTime: {
        type: Date,
        default: Date.now,
    },
});

// Vehicle model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;