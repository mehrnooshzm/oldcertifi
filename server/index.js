require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRouter = require('./routes/authRoute');
const designsRouter = require('./routes/designsRoute');
const templatesRouter = require('./routes/templatesRoute');
const uploadsRouter = require('./routes/uploadsRoute');

const app = express();

app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) for all routes and origins
app.use(express.json()); // Built-in Express middleware; parses incoming requests with JSON payloads

app.use('/api/auth', authRouter);
app.use('/api/designs', designsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/uploads', uploadsRouter);

// Serve frontend build files in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
