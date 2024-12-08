import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehicleStates.css";

const VehicleStatesManagement = () => {
    const [vehicles, setVehicles] = useState([]); // All vehicles data
    const [filteredVehicles, setFilteredVehicles] = useState([]); // Filtered vehicles based on state
    const [selectedState, setSelectedState] = useState("all"); // Default state to "all"
    const [currentPage, setCurrentPage] = useState(1); // Default page 1
    const [itemsPerPage, setItemsPerPage] = useState(5); // Set number of items per page
    const [totalVehicles, setTotalVehicles] = useState(0); // Total vehicles for pagination
    const [searchTerm, setSearchTerm] = useState(""); // search term for vehicle Id
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [newState, setNewState] = useState("");

    // Fetch all vehicles from the API
    useEffect(() => {
        fetchVehicles();
    }, []); 

    // Fetch vehicles based on selected state
    useEffect(() => {
        if (selectedState === "all") {
            fetchVehicles(); // Fetch all vehicles if "all" is selected
        } else {
            fetchVehiclesByState(selectedState); // Fetch vehicles by selected state
        }
    }, [selectedState, currentPage]); // Re-fetch when state or page changes

    // Function to fetch all vehicles
    const fetchVehicles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/vehicles",{
                 params: { page: currentPage, limit: itemsPerPage }});
            ;

            const vehiclesData = response.data || []; // Default to empty array if no vehicles
            setVehicles(vehiclesData);
            setTotalVehicles(vehiclesData.length); // Set total vehicles count for pagination
            setFilteredVehicles(vehiclesData); // Initially, all vehicles are considered filtered
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    // Function to fetch vehicles based on selected state
    const fetchVehiclesByState = async (state) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/vehicles/${state}`, {
                params: {page: currentPage, limit: itemsPerPage },
            });

            const vehiclesData = response.data || []; // Default to empty array if no vehicles
            setVehicles(vehiclesData);
            setTotalVehicles(vehiclesData.length); // Set total vehicles count for pagination
            setFilteredVehicles(vehiclesData); // Set filtered vehicles
        } catch (error) {
            console.error("Error fetching filtered vehicles:", error);
        }
    };

    // Handle filter changes
    const handleStateFilter = (event) => {
        setSelectedState(event.target.value); // Update the selected state
        setCurrentPage(1); //Reset to first page when filter changes
        setSearchTerm(""); // clear search term when filter changes
    };

    const handleSearch = (e) => {
        const term = e.target.value.trim();// get the search term
        setSearchTerm(term);
        // If search term is empty, reset to filtered vehicles based on selected state
        if(term === ""){
            setFilteredVehicles(vehicles);
            return;
        }
        const searchedVehicles = vehicles.filter((vehicle) => 
            vehicle.vehicleId.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVehicles(searchedVehicles);
    } 

    // Handle page change for pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Update current page number
    };

    // Edit vehicle handler
    const handleEdit = (vehicleId) => {
        setEditingVehicleId(vehicleId); // Set the vehicleId being edited
        const vehicle = vehicles.find((v) => v.vehicleId === vehicleId); // Find the vehicle with matching ID
        if (vehicle) {
            setNewState(vehicle.state); // Set the initial state in the dropdown
        }
    };
    

    // Update vehicle handler
    const handleUpdate = async (vehicleId) => {
        try {
            // Log to debug the data being sent
            //console.log("Sending update Request:", { vehicleId, state: newState });
    
            // Make the PUT request with the correct payload
            const response = await axios.put("http://localhost:5000/api/vehicles", {
                vehicleId, // Include the vehicleId
                state: newState, // Include the updated state
            });
    
            if (response.status === 200) {
                const updatedVehicle = response.data; // Backend should return the updated vehicle
                // console.log("updated vehicle list", updatedVehicle);
                const updatedVehicles = vehicles.map((vehicle) =>
                    vehicle.vehicleId === vehicleId ? { ...vehicle, state: newState } : vehicle
                );
               
                setVehicles(updatedVehicles);
                setFilteredVehicles(updatedVehicles);
                setEditingVehicleId(null); // Exit editing mode
                setNewState(""); // Reset the new state
                console.log("Vehicle updated successfully.");
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
            if (error.response) {
                alert(`Error: ${error.response.data.message}`);
            }
        }
    };
    

    // Pagination logic
    const totalPages = Math.ceil(totalVehicles / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="vehicle-states-container">
            <h2>Vehicle States Management</h2>

           <div className="search-filter-container">
                 {/* Filter Section */}
            <div className="filter-section">
                <label htmlFor="state">Filter by State:</label>
                <select id="state" value={selectedState} onChange={handleStateFilter}>
                    <option value="all">All States</option>
                    <option value="rtd">RTD</option>
                    <option value="service">Service</option>
                    <option value="missing">Missing</option>
                    <option value="deployed">Deployed</option>
                </select>
            </div>
            
             {/* Search Section */}
            <div className="serach-section">
                <label htmlFor="search">Search by Vehicle ID:</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Enter Vehicle ID"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
           </div>
           

            {/* Table Section */}
            <table className="vehicle-table">
                <thead>
                    <tr>
                        <th>Vehicle ID</th>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.vehicleId}>
                                <td>{vehicle.vehicleId}</td>
                                <td>
                                    {editingVehicleId === vehicle.vehicleId ? (
                                        <select
                                            value={newState}
                                            onChange={(e) => setNewState(e.target.value)}
                                        >
                                            <option value="rtd">RTD</option>
                                            <option value="service">Service</option>
                                            <option value="missing">Missing</option>
                                            <option value="deployed">Deployed</option>
                                        </select>
                                    ) : (
                                        vehicle.state
                                    )}
                                </td>
                                <td>
                                    {editingVehicleId === vehicle.vehicleId ? (
                                        <>
                                            <button onClick={() => handleUpdate(vehicle.vehicleId)}>Save</button>
                                            <button onClick={() => setEditingVehicleId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(vehicle.vehicleId)}>Edit</button>
                                    )}
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No vehicles found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Section */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VehicleStatesManagement;
