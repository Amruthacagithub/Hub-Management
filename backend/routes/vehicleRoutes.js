// routes

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleControllers');

// Route for creating a new vehicle entry
router.post('/vehicles', vehicleController.createVehicle);

// Route for fetching all vehicles
router.get('/vehicles', vehicleController.getAllVehicles);

// get a specific vehicle by id

// Route for updating the vehicle state
router.put('/vehicles', vehicleController.updateVehicleState);

// Delete a specific vehicle by id 

// get all vehicles by state
router.get('/vehicles/:state', vehicleController.getAllVehiclesByState);

module.exports = router;