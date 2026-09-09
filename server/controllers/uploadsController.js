const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('../firebase-admin');

const MAX_BATCH_LENGTH = 500;

// GET /api/uploads/:uploadId
const getUpload = async (req, res) => {
  const uid = req.user.uid;
  const { uploadId } = req.params;

  try {
    const snapshot = await db.ref(`uploads/${uid}/${uploadId}`).get();
    const upload = snapshot.val();

    if (!upload) {
      return res
        .status(404)
        .json({ error: `Upload with ID ${uploadId} is not found` });
    }

    const batches = upload.batches || {};

    // Flatten all batch rows into one array
    const rows = Object.values(batches).flatMap((batch) => {
      return Array.isArray(batch) ? batch : Object.values(batch);
    });

    const { fileName, createdAt, rowCount } = upload;

    res.json({
      id: uploadId,
      fileName,
      createdAt,
      rowCount,
      rows,
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upload' });
  }
};

// POST /api/uploads
const createUpload = async (req, res) => {
  const uid = req.user.uid;

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;

  const userRef = db.ref(`uploads/${uid}`);
  const newUploadRef = userRef.push();
  const id = newUploadRef.key;

  const newUpload = {
    id,
    fileName: req.file.originalname,
    createdAt: Date.now(),
  };

  try {
    await newUploadRef.set(newUpload);

    let rowCount = 0;
    let batch = [];
    const rows = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
      rowCount++;
      batch.push(row);
      rows.push(row);

      if (batch.length >= MAX_BATCH_LENGTH) {
        await newUploadRef.child('batches').push(batch);
        batch = [];
      }
    }

    // Save leftover rows
    if (batch.length > 0) {
      await newUploadRef.child('batches').push(batch);
    }

    await newUploadRef.update({
      rowCount,
      rows,
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    });

    res.status(201).json({
      ...newUpload,
      rowCount,
      rows,
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Failed to parse or save CSV' });
  } finally {
    fs.unlink(filePath, () => {}); // cleanup temp file
  }
};

// DELETE /api/uploads/:uploadId
const deleteUpload = async (req, res) => {
  const uid = req.user.uid;
  const { uploadId } = req.params;

  try {
    const uploadRef = db.ref(`uploads/${uid}/${uploadId}`);
    await uploadRef.remove();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete upload' });
  }
};

module.exports = {
  getUpload,
  createUpload,
  deleteUpload,
};
