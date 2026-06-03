import React, { useState } from 'react';

export default function App() {
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState([]);
  const [status, setStatus] = useState('');

  const analyzeContent = async () => {
    setStatus('Analyzing Page Content...');
    // Connect to your deployed backend URL here
    const res = await fetch('https://your-backend-url.onrender.com/api/analyze-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    setAudience(data.targetAudience);
    setStatus('Analysis Complete. Audience Generated.');
  };

  const launchCampaign = async () => {
    setStatus('Launching to Ads Manager...');
    const res = await fetch('https://your-backend-url.onrender.com/api/launch-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        adAccountId: 'YOUR_AD_ACCOUNT_ID', 
        campaignId: 'YOUR_CAMPAIGN_ID',
        interests: audience 
      })
    });
    const data = await res.json();
    if (data.success) {
      setStatus(`Success! Ad Set Created: ${data.adSetId}`);
    } else {
      setStatus('Failed to launch campaign.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">Smart Ad Placer</h1>
      
      <textarea 
        className="w-full p-4 border rounded mb-4"
        rows="4" 
        placeholder="Paste your Facebook Page post or content idea here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <button 
        onClick={analyzeContent}
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
      >
        Analyze Content & Find Audience
      </button>

      {audience.length > 0 && (
        <div className="mt-8 border p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-2">Targeting "AND" Cluster Found:</h2>
          <ul className="list-disc pl-6 mb-4">
            {audience.map(int => <li key={int.id}>{int.name}</li>)}
          </ul>
          <button 
            onClick={launchCampaign}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
          >
            Launch Campaign
          </button>
        </div>
      )}

      {status && <p className="mt-4 font-bold text-gray-700">{status}</p>}
    </div>
  );
}
