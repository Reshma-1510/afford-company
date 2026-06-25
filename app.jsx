import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, TextField, Box } from '@mui/material';
import AllNotifications from './AllNotifications';
import PriorityNotifications from './PriorityNotifications';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || 'ahXjvp');

  const handleTokenChange = (e) => {
    const value = e.target.value;
    setToken(value);
    localStorage.setItem('token', value);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">All Notifications</Button>
          <Button color="inherit" component={Link} to="/priority">Priority Inbox</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <TextField 
            label="Enter API Access Token" 
            variant="outlined" 
            fullWidth 
            value={token} 
            onChange={handleTokenChange} 
          />
        </Box>
        <Routes>
          <Route path="/" element={<AllNotifications token={token} />} />
          <Route path="/priority" element={<PriorityNotifications token={token} />} />
        </Routes>
      </Container>
    </Router>
  );
}