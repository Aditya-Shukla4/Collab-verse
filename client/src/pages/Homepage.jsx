import React, { useState, useEffect } from 'react';
import { getTestMessage } from '../services/api'; 

function HomePage() {
  const [message, setMessage] = useState('Loading...'); // Initial state

  useEffect(() => {
    
    getTestMessage()
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        setMessage('Failed to fetch message from server.'); 
      });
  }, []); 

  return (
    <div>
      <h1>Collab-Verse</h1>
      <p><strong>Message from Server:</strong> {message}</p>
    </div>
  );
}

export default HomePage;