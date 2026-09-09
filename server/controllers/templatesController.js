const { db } = require('../firebase-admin');

// GET /api/templates
const getAllTemplates = async (_, res) => {
  try {
    const snapshot = await db.ref('templates').get();
    const templates = snapshot.val();

    // Firebase returns null or undefined when there is no data; return an empty array instead
    if (!templates) return res.json([]);

    // Convert Firebase object to array with id included
    const templatesList = Object.entries(templates).map(([id, data]) => ({
      id,
      ...data,
    }));
    res.json(Object.values(templatesList)); // Send templates as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to get templates' });
  }
};

module.exports = {
  getAllTemplates, // Export function
};
