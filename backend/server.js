const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const columnRoutes = require('./routes/columns');
const cors = require('cors');
 

const app = express();

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
// Middleware
// Define a simple route

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));