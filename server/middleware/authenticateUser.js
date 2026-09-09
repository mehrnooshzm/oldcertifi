const { admin } = require('../firebase-admin');

// Middleware to authenticate user via Firebase ID token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and has Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify token
    req.user = decodedToken; // Attach user info to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateUser;
