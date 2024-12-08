import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehicleEntry.css";

const VehicleEntry = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [state, setState] = useState('');
  const [vehicleData, setVehicleData] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search input

  // Fetching data on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/vehicles")
      .then(response => {
        const sortedEntries = response.data.sort(
          (a, b) => new Date(b.entryTime) - new Date(a.entryTime) // Sort by latest first
        );
        setRecentEntries(sortedEntries); // Set the most recent entries
        setFilteredEntries(sortedEntries); // Also set filtered entries to initial data
        setVehicleData(response.data); // Store vehicle data
      })
      .catch(error => console.error("Error fetching vehicle data:", error));
  }, []);

  // Handle form submission to add a new vehicle entry
  const handleAddVehicleEntry = (e) => {
    e.preventDefault();

    if (!vehicleId || !state) {
      alert("Vehicle ID and State are required fields!");
      return;
    }

    const entryTime = new Date().toISOString();  // Correctly formatted ISO string for date

    const newVehicle = {
      vehicleId,
      state,
      entryTime
    };

    axios.post("http://localhost:5000/api/vehicles", newVehicle)
      .then((response) => {
        setRecentEntries([response.data, ...recentEntries]);
        setFilteredEntries([response.data, ...filteredEntries]);  // Update filtered entries as well
        setVehicleId('');
        setState('');
      })
      .catch((error) => {
        console.error("Error adding vehicle entry:", error);
      });
  };

  // Handle search input and filter the entries
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = recentEntries.filter((entry) =>
      entry.vehicleId.toLowerCase().includes(value) || entry.state.toLowerCase().includes(value)
    );
    setFilteredEntries(filtered);
  };

  return (
    <div className="vehicle-entry-container">
      <h2>Vehicle Entry Recording</h2>

      {/* Vehicle Entry Form */}
      <div className="form-section">
        <form onSubmit={handleAddVehicleEntry}>
          <div className="form-group">
            <label>Vehicle ID</label>
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Select State</option>
              <option value="rtd">RTD</option>
              <option value="service">Service</option>
              <option value="deployed">Deployed</option>
              <option value="missing">Missing</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Add Vehicle Entry</button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by Vehicle ID or State"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      {/* Recent Entries Table */}
      <div className="recent-entries">
        <h3>Recent Vehicle Entries</h3>
        <table>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>State</th>
              <th>Entry Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.vehicleId}</td>
                <td>{vehicle.state}</td>
                <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleEntry;
