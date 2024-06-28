import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const Top10 = async () => {
      try {
        const response = await axios.get('/api/top10');
        setTracks(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    Top10();
  }, []);

  return (
      <div className="App">
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <h1>Türkiye Top 10 Şarkı</h1>
          </div >
        <ol>
          {tracks.slice(0,10).map((track, index) => (
              <li key={index}>{track.track.artists[0].name} - {track.track.name}</li>
          ))}
        </ol>
      </div>
  );
}

export default App;
