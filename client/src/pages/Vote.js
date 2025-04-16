import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { ethers } from 'ethers';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/candidates');
      setCandidates(response.data);
    } catch (err) {
      setError('Failed to fetch candidates. Please try again later.');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate || !walletAddress) {
      setError('Please select a candidate and enter your wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Connect to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Send vote transaction
      const response = await axios.post('http://localhost:5000/api/vote', {
        candidateId: selectedCandidate,
        voterAddress: walletAddress,
      });

      setSuccess('Vote cast successfully! Transaction hash: ' + response.data.transactionHash);
      setSelectedCandidate(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Cast Your Vote
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Connect Your Wallet
          </Typography>
          <TextField
            fullWidth
            label="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {candidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                border: selectedCandidate === candidate.id ? 2 : 0,
                borderColor: 'primary.main',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {candidate.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {candidate.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Votes: {candidate.voteCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleVote}
          disabled={loading || !selectedCandidate || !walletAddress}
          sx={{ minWidth: 200 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Cast Vote'}
        </Button>
      </Box>
    </Box>
  );
};

export default Vote; 