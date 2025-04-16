import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';

const features = [
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Secure Voting',
    description: 'Votes are recorded on the blockchain, ensuring transparency and immutability.',
  },
  {
    icon: <HowToVoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Easy to Use',
    description: 'Simple and intuitive interface for casting your vote securely.',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Real-time Results',
    description: 'View voting results in real-time as they are recorded on the blockchain.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Blockchain Voting System
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            A secure, transparent, and decentralized voting platform powered by blockchain technology.
            Cast your vote with confidence knowing that your choice is immutable and verifiable.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/vote')}
            >
              Cast Your Vote
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/results')}
            >
              View Results
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 