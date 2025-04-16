import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
    // Set up polling for real-time updates
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/candidates');
      setCandidates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch results. Please try again later.');
      setLoading(false);
    }
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return (votes / total) * 100;
  };

  const getTotalVotes = () => {
    return candidates.reduce((sum, candidate) => sum + parseInt(candidate.voteCount), 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Voting Results
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Votes Cast: {getTotalVotes()}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {candidates.map((candidate) => {
          const percentage = calculatePercentage(
            parseInt(candidate.voteCount),
            getTotalVotes()
          );

          return (
            <Grid item xs={12} key={candidate.id}>
              <Card
                sx={{
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{candidate.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {candidate.voteCount} votes ({percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {candidate.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Results; 