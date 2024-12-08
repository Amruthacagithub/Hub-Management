// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const vehicleRoutes = require('./routes/vehicleRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Database Connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('MongoDB connection failed:', error));

//Routes
app.use('/api', vehicleRoutes);
app.use('/api/tasks', taskRoutes);


// Server Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})