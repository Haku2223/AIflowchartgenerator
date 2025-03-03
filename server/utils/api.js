export async function generateFlowchart(userId, promptText) {
    const response = await fetch('http://localhost:3001/api/flowcharts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt: promptText }),
    });
    return response.json();
  }
  