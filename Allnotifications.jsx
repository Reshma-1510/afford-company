import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import { fetchWithLogging } from './apiClient';

export default function AllNotifications({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewed, setViewed] = useState(JSON.parse(localStorage.getItem('viewed')) || []);

  useEffect(() => {
    if (!token) return;
    const url = `http://4.224.186.213/evaluation-service/notifications?page=${page}&limit=${limit}`;
    
    fetchWithLogging(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setNotifications(data.notifications || []);
    })
    .catch(err => console.error(err));
  }, [page, limit, token]);

  const markViewed = (id) => {
    const newViewed = [...new Set([...viewed, id])];
    setViewed(newViewed);
    localStorage.setItem('viewed', JSON.stringify(newViewed));
  };

  return (
    <Box>
       <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
         <FormControl sx={{ minWidth: 120 }}>
           <InputLabel>Limit</InputLabel>
           <Select value={limit} label="Limit" onChange={(e) => setLimit(e.target.value)}>
             <MenuItem value={10}>10</MenuItem>
             <MenuItem value={20}>20</MenuItem>
             <MenuItem value={50}>50</MenuItem>
           </Select>
         </FormControl>
       </Stack>

       {notifications.map(n => (
         <Card 
           key={n.ID} 
           sx={{ 
             mb: 2, 
             bgcolor: viewed.includes(n.ID) ? '#f5f5f5' : '#e3f2fd',
             cursor: 'pointer',
             borderLeft: viewed.includes(n.ID) ? 'none' : '4px solid #1976d2'
           }} 
           onClick={() => markViewed(n.ID)}
         >
           <CardContent>
             <Typography variant="h6" color="primary">{n.Type}</Typography>
             <Typography variant="body1">{n.Message}</Typography>
             <Typography variant="caption" color="textSecondary">{n.Timestamp}</Typography>
           </CardContent>
         </Card>
       ))}
       
       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
         <Pagination count={10} page={page} onChange={(e, v) => setPage(v)} color="primary" />
       </Box>
    </Box>
  );
}