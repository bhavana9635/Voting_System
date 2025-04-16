const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain-voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Connect to the blockchain network
let provider, wallet, contract;
try {
  provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Contract ABI
  const contractABI = [
      "function getCandidate(uint256) view returns (uint256, string, string, uint256)",
      "function candidatesCount() view returns (uint256)",
      "function vote(uint256)",
      "function hasVoted(address) view returns (bool)",
      "function votingOpen() view returns (bool)"
  ];

  // Only create contract if address is valid
  if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
    contract = new ethers.Contract(contractAddress, contractABI, wallet);
    console.log('Blockchain contract connected');
  } else {
    console.log('Contract address not set. Running in mock mode.');
  }
} catch (error) {
  console.error('Blockchain connection error:', error.message);
  console.log('Running in mock mode without blockchain connection');
}

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);

// Mock data for development
const mockCandidates = [
  {
    id: '1',
    name: 'Candidate 1',
    description: 'Description for Candidate 1',
    voteCount: '5'
  },
  {
    id: '2',
    name: 'Candidate 2',
    description: 'Description for Candidate 2',
    voteCount: '3'
  },
  {
    id: '3',
    name: 'Candidate 3',
    description: 'Description for Candidate 3',
    voteCount: '7'
  }
];

// Get all candidates
app.get('/api/candidates', async (req, res) => {
    try {
        if (contract) {
            const count = await contract.candidatesCount();
            const candidates = [];
            
            for (let i = 1; i <= count; i++) {
                const candidate = await contract.getCandidate(i);
                candidates.push({
                    id: candidate[0].toString(),
                    name: candidate[1],
                    description: candidate[2],
                    voteCount: candidate[3].toString()
                });
            }
            
            res.json(candidates);
        } else {
            // Return mock data if contract is not available
            res.json(mockCandidates);
        }
    } catch (error) {
        console.error('Error fetching candidates:', error);
        // Return mock data on error
        res.json(mockCandidates);
    }
});

// Cast a vote
app.post('/api/vote', async (req, res) => {
    try {
        const { candidateId, voterAddress } = req.body;
        
        if (contract) {
            // Check if voting is open
            const isOpen = await contract.votingOpen();
            if (!isOpen) {
                return res.status(400).json({ error: 'Voting is currently closed' });
            }
            
            // Check if user has already voted
            const hasVoted = await contract.hasVoted(voterAddress);
            if (hasVoted) {
                return res.status(400).json({ error: 'You have already voted' });
            }
            
            // Cast the vote
            const tx = await contract.vote(candidateId);
            await tx.wait();
            
            res.json({ success: true, transactionHash: tx.hash });
        } else {
            // Mock vote for development
            console.log(`Mock vote cast for candidate ${candidateId} by ${voterAddress}`);
            res.json({ success: true, transactionHash: '0x' + Math.random().toString(16).substring(2, 42) });
        }
    } catch (error) {
        console.error('Error casting vote:', error);
        res.status(500).json({ error: error.message });
    }
});

// Check voting status
app.get('/api/voting-status', async (req, res) => {
    try {
        if (contract) {
            const isOpen = await contract.votingOpen();
            res.json({ isOpen });
        } else {
            // Mock voting status for development
            res.json({ isOpen: true });
        }
    } catch (error) {
        console.error('Error checking voting status:', error);
        res.json({ isOpen: true });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 