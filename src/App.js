// src/App.js
import React, { useEffect, useState } from 'react';

// If you’re using separate helper files:
// import { getOrCreateUserId } from './utils/userId';
// import { generateFlowchart } from './utils/api';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check localStorage for existing userId
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Or use "uuidv4" from a library if needed
      const newUserId = crypto.randomUUID(); 
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleGenerate = async () => {
    if (!userId) {
      console.log('No userId found.');
      return;
    }

    const promptText = 'Sample prompt...';

    try {
      // If you have a fetch or axios call:
      const response = await fetch('http://localhost:3001/api/flowcharts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, prompt: promptText }),
      });
      const data = await response.json();
      console.log('Generate result:', data);
    } catch (error) {
      console.error('Error generating flowchart:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to AI Flowchart Generator</h1>
      <p>Your userId is: {userId}</p>
      <button onClick={handleGenerate}>Generate Flowchart</button>
    </div>
  );
}

export default App;
