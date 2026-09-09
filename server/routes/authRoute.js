const { signup } = require('../controllers/authController'); // Import signup controller
const authRouter = require('express').Router(); // Create a new router

// Route for user signup
authRouter.post('/signup', signup);

module.exports = authRouter; // Export the router
