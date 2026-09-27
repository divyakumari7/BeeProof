require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const seedDatabase = require('./data/seed');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const beekeeperRoutes = require('./routes/beekeeperRoutes');
const processorRoutes = require('./routes/processorRoutes');
const qualityLabRoutes = require('./routes/qualityLabRoutes');
const distributorRoutes = require('./routes/distributorRoutes');
const iotRoutes = require('./routes/iotRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Standard Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));


// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'BeeProof-Node-Express-Backend',
    version: '2.0.0',
    blockchain: {
      network: 'Solana Devnet',
      programId: process.env.SOLANA_PROGRAM_ID || 'BP11111111111111111111111111111111111111111'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/beekeeper', beekeeperRoutes);
app.use('/api/processor', processorRoutes);
app.use('/api/quality-lab', qualityLabRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// JSON 404 Fallback for unhandled API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Error Handling Middleware
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    // Check if initial seeding is required
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Running initial seeder...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🐝 BeeProof Backend running on http://localhost:${PORT}`);
      console.log(`REST API Base URL: http://localhost:${PORT}/api`);
      console.log(`Public Verification: http://localhost:${PORT}/api/verify/batch/BP-2026-SUN-001`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log(`==================================================`);
    });

    return server;
  } catch (err) {
    console.error('Fatal error starting BeeProof backend:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
