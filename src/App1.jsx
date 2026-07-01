import React from 'react'
import { useState, useEffect } from "react";
import Header from './Header.jsx';


export default function App1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://dogapi.dog/api/v1/facts?number=2`)
      .then((response) => response.json())
      .then((data) => {

        setData(data.facts); 
      })
      .catch((error) => console.error(error));
  }, []); // The empty array [] ensures this only runs once on mount

  return (
    <div className="App">
      <Header /> 
        <main style={{ padding: '20px' }}>
        {/* 1. The Dog Facts List */}
        <h3>Fun Dog Facts:</h3>
        <ul>
          {data.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>

        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        </main>
    </div>
  );
}