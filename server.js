const express = require('express');
const app = express();
const userRoutes = require('./route/userRToute');
const Todoroute = require('./route/todoRoute')
const Databaseconnector = require('./dartabase/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); 

app.use(express.json());
app.use(cookieParser());
// Allow requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Set this to your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Define the HTTP methods allowed
  credentials: true  // Enable this if you are sending cookies or other credentials
}));  // Allow frontend to communicate with the backend


app.use('/user', userRoutes);
app.use('/todo', Todoroute);

// use of database
Databaseconnector();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});