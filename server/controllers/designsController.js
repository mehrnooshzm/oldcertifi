const { db } = require('../firebase-admin');

// GET /api/designs
const getAllDesigns = async (req, res) => {
  const uid = req.user.uid;

  try {
    const snapshot = await db.ref(`designs/${uid}`).get();
    const designs = snapshot.val();

    // Firebase returns null or undefined when there is no data; return an empty array instead
    if (!designs) return res.json([]);

    const designsList = Object.entries(designs).map(([id, data]) => ({
      id,
      ...data,
    }));
    res.json(Object.values(designsList));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get designs' });
  }
};

// GET /api/designs/:designId
const getDesign = async (req, res) => {
  const uid = req.user.uid;
  const { designId } = req.params;

  try {
    const snapshot = await db.ref(`designs/${uid}/${designId}`).get();
    const design = snapshot.val();

    if (!design) {
      return res
        .status(404)
        .json({ error: `Design with ID ${designId} is not found` });
    }

    res.json(design);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};

// POST /api/designs
const createDesign = async (req, res) => {
  const uid = req.user.uid;

  try {
    const userRef = db.ref(`designs/${uid}`);

    const newDesignRef = userRef.push();
    const id = newDesignRef.key;

    const newDesign = { ...req.body, id, createdAt: Date.now() };
    await newDesignRef.set(newDesign);

    res.status(201).json(newDesign);
  } catch (error) {
    console.error('Error saving design:', error);
    res.status(500).json({ error: 'Failed to save design' });
  }
};

// PUT /api/designs/:designId
const updateDesign = async (req, res) => {
  const uid = req.user.uid;
  const { designId } = req.params;

  try {
    const updatedDesign = {
      ...req.body,
      updatedAt: Date.now(),
    };
    await db.ref(`designs/${uid}/${designId}`).update(updatedDesign);

    res.json(updatedDesign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update design' });
  }
};

// DELETE /api/designs/:designId
const deleteDesign = async (req, res) => {
  const uid = req.user.uid;
  const { designId } = req.params;

  try {
    const designRef = db.ref(`designs/${uid}/${designId}`);
    await designRef.remove();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design' });
  }
};

module.exports = {
  getAllDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
};
