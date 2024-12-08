import React from "react";
import "./HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [vehicleData, setVehicleData] = useState([]);
    const [taskCount, setTaskCount] = useState(0);
    const [recentEntries, setRecentEntries] = useState([]);
    const [vehicleStates, setVehicleStates] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/vehicles")
        .then(response => {
            setVehicleData(response.data);
            const stateCounts = response.data.reduce((acc, vehicle) => {
                const state = vehicle.state;
                acc[state] = acc[state] ? acc[state]+1 : 1;
                return acc;
            }, {});
            setVehicleStates(Object.entries(stateCounts).map(([state, count]) => ({state, count})));

            setTaskCount(response.data.filter(vehicle => vehicle.state === 'deployed').length);

            const sortedEntries = response.data.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
            setRecentEntries(sortedEntries.slice(0, 5));  // Get top 5 recent entries
          })
        .catch(error => console.error("Error fetching vehicle data:", error));
    }, []);

    const stateColors = {
        'rtd': '#4caf50',       
        'service': '#f44336',   
        'missing': '#ff9800',   
        'deployed': '#2196f3'
    }

    return (
        <div className="home-container">
            <h2>Dashboard</h2>
                <div className="vehicle-state-chart">
                    <h1>Vehicle States</h1>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={vehicleStates}
                                dataKey="count"
                                nameKey="state"
                                outerRadius={120}
                                fill="#8884d8"
                                label
                            >
                                {vehicleStates.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={stateColors[entry.state]} />
                                    ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="task-count">
                    <h3>Deployed Task Count</h3>
                    <p>{taskCount}</p>
                </div>
                <div className="recent-entries">
                    <h3>Recent Vehicle Entries</h3>
                    <ul>
                        {recentEntries.map(vehicle => (
                        <li key={vehicle.id}>
                            <strong>Vehicle ID:</strong> {vehicle.vehicleId} <br />
                            <strong>State:</strong> {vehicle.state} <br />
                            <strong>Entry Time:</strong> {new Date(vehicle.entryTime).toLocaleString()}
                        </li>
                        ))}
                    </ul>
                </div>
                <div className="quick-links">
                    <ul>
                    <li><Link to="/vehicle-states">Vehicle States</Link></li>
                    <li><Link to="/vehicle-entry">Vehicle Entries</Link></li>
                    <li><Link to="/task-allocation">Task Allocation</Link></li>
                    <li><Link to="/hub-team-profile">Hub Team Profile</Link></li>
                    <li><Link to="/reporting">Reporting Pages</Link></li>
                    <li><Link to="/profile-settings">Profile Settings</Link></li>
                    </ul>
                </div>
            </div>
    );
};

export default HomePage;