const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain-voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for initialization'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  walletAddress: String,
  hasVoted: Boolean,
  votedFor: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

// Define Candidate schema
const candidateSchema = new mongoose.Schema({
  name: String,
  description: String,
  voteCount: Number,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Initialize database with test data
async function initializeDB() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Candidate.deleteMany({});
    console.log('Cleared existing data');

    // Create test candidates
    const candidates = await Candidate.create([
      {
        name: 'Candidate 1',
        description: 'Description for Candidate 1',
        voteCount: 5,
      },
      {
        name: 'Candidate 2',
        description: 'Description for Candidate 2',
        voteCount: 3,
      },
      {
        name: 'Candidate 3',
        description: 'Description for Candidate 3',
        voteCount: 7,
      },
    ]);
    console.log('Created test candidates');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create test users
    await User.create([
      {
        name: 'Test User 1',
        email: 'user1@example.com',
        password: hashedPassword,
        walletAddress: '0x1234567890123456789012345678901234567890',
        hasVoted: false,
        createdAt: new Date(),
      },
      {
        name: 'Test User 2',
        email: 'user2@example.com',
        password: hashedPassword,
        walletAddress: '0x0987654321098765432109876543210987654321',
        hasVoted: true,
        votedFor: candidates[0]._id,
        createdAt: new Date(),
      },
    ]);
    console.log('Created test users');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDB(); 