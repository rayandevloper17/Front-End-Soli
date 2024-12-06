import React, { useState } from 'react';
import { Avatar, Button, TextField, Grid, Box, Typography, Container, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Handle login logic (e.g., API call) here
    console.log({ email, password });

    // Reset error if login is successful
    setError('');
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        padding: '20px'
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ padding: '30px', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
              Welcome Back
            </Typography>
            <Typography component="p" variant="body2" sx={{ marginBottom: 4, color: '#555', textAlign: 'center' }}>
              Sign in to access your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#6a11cb',
                  padding: '10px',
                  borderRadius: 2,
                  ':hover': { backgroundColor: '#5a0fa8' }
                }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button variant="text" color="primary" size="small" sx={{ textTransform: 'none' }}>
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="text" color="primary" size="small" sx={{ textTransform: 'none' }}>
                    {"Don't have an account? Sign Up"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
