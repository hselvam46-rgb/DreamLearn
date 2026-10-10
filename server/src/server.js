const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, disconnectDB } = require('./config/db');
const { seedDatabase } = require('./services/seeder');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const codingRoutes = require('./routes/codingRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/code', codingRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/certificates', certificateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DreamLearn LMS & Placement Preparation',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`,
  });
});

// Serve static frontend assets in production if client/dist exists
const clientDistPath = path.join(__dirname, '../../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

// Bootstrap server and database
const startServer = async () => {
  const server = app.listen(PORT, async () => {
    console.log(`====================================================`);
    console.log(`🚀 DreamLearn Server running on port ${PORT}`);
    console.log(`📡 API Base: /api/v1`);
    console.log(`📂 Client build exists: ${fs.existsSync(clientDistPath)}`);
    console.log(`====================================================`);

    try {
      await connectDB();
      await seedDatabase();
    } catch (err) {
      console.warn('Database initialization note:', err.message);
    }
  });

  // Graceful shutdown
  const handleShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
};

startServer();

module.exports = app;
