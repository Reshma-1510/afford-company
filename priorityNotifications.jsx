import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import { fetchWithLogging } from './apiClient';

export default function PriorityNotifications({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [n, setN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewed, setViewed] = useState(JSON.parse(localStorage.getItem('viewed')) || []);

  useEffect(() => {
    if (!token) return;
    
    let url = `http://4.224.186.213/evaluation-service/notifications?limit=100`;
    if (typeFilter !== 'All') {
       url += `&notification_type=${typeFilter}`;
    }

    fetchWithLogging(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const arr = data.notifications || [];
        const weights = { 'placement': 3, 'result': 2, 'event': 1 };
        
        const sorted = arr.sort((a, b) => {
            const wA = weights[a.Type.toLowerCase()] || 0;
            const wB = weights[b.Type.toLowerCase()] || 0;
            if (wA !== wB) return wB - wA;
            
            const timeA = new Date(a.Timestamp.replace(' ', 'T')).getTime();
            const timeB = new Date(b.Timestamp.replace(' ', 'T')).getTime();
            return timeB - timeA;
        });
        
        setNotifications(sorted.slice(0, n));
    })
    .catch(err => console.error(err));
  }, [n, typeFilter, token]);

  const markViewed = (id) => {
    const newViewed = [...new Set([...viewed, id])];
    setViewed(newViewed);
    localStorage.setItem('viewed', JSON.stringify(newViewed));
  };

  return (
    <Box>
       <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
         <TextField 
           type="number" 
           label="Top 'N'" 
           value={n} 
           onChange={(e) => setN(Number(e.target.value))} 
           sx={{ width: 100 }}
         />
         <FormControl sx={{ minWidth: 150 }}>
           <InputLabel>Filter Type</InputLabel>
           <Select value={typeFilter} label="Filter Type" onChange={(e) => setTypeFilter(e.target.value)}>
             <MenuItem value="All">All</MenuItem>
             <MenuItem value="Event">Event</MenuItem>
             <MenuItem value="Result">Result</MenuItem>
             <MenuItem value="Placement">Placement</MenuItem>
           </Select>
         </FormControl>
       </Stack>

       {notifications.map(item => (
         <Card 
           key={item.ID} 
           sx={{ 
             mb: 2, 
             bgcolor: viewed.includes(item.ID) ? '#f5f5f5' : '#fff3e0',
             cursor: 'pointer',
             borderLeft: viewed.includes(item.ID) ? 'none' : '4px solid #ed6c02'
           }} 
           onClick={() => markViewed(item.ID)}
         >
           <CardContent>
             <Typography variant="h6" color="warning.main">{item.Type}</Typography>
             <Typography variant="body1">{item.Message}</Typography>
             <Typography variant="caption" color="textSecondary">{item.Timestamp}</Typography>
           </CardContent>
         </Card>
       ))}
    </Box>
  );
}