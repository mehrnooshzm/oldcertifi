const { admin } = require('../firebase-admin'); // Import Firebase Admin SDK

// Controller function to handle user signup
const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullname,
    });

    // Send success response with user info
    res.status(200).json({
      message: 'Signup successful',
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup }; // Export the signup function
