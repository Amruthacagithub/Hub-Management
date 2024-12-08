// controller
const Vehicle = require('../models/Vehicle');

// new vehicle entry
const createVehicle = async (req,res) => {
    try{
        const {vehicleId, state} = req.body;
        // checking if the vehicle already exists
        const existingVehicle = await Vehicle.findOne({vehicleId});
        if(existingVehicle){
            return res.status(400).json({message: 'Vehicle ID already exists'});
        }

        const newVehicle = new Vehicle({
            vehicleId,
            state,
        });

        await newVehicle.save();
        res.status(201).json({message: 'Vehicle created successfully', vehicle: newVehicle});
    }
    catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// fetching vehicle details
const getAllVehicles = async (req, res) => {
    try{
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    }
    catch (error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// update vehicle state
const updateVehicleState = async (req, res) => {
    try{
        const {vehicleId, state} = req.body;
        // validating the state
        if(!['service', 'rtd', 'missing', 'deployed'].includes(state)){
            return res.status(400).json({message: 'Invalid vehicle state'});
        }

        const vehicle = await Vehicle.findOne({vehicleId});
        if(!vehicle){
            return res.status(404).json({message: 'Vehicle not found'});
        }
        vehicle.state = state;
        await vehicle.save();

        res.status(200).json({message: 'Vehicle state updated', vehicle});
    }
    catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};


// get all vehicles by state 
const getAllVehiclesByState = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({state: req.params.state});
        res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({message: "Error retrieving vehicles by state", error: error.message});
    };
}

module.exports = {
    createVehicle,
    getAllVehicles,
    updateVehicleState,
    getAllVehiclesByState,
};