import React from 'react';
import logo from './assets/headerlogo.PNG';

export default function Header() {
  return (
<header className="header-container" style={{ padding: '10px 0' }}>
<div className="logo-section" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '2px' // lower number pull them closer ver
      }}>
        <img
src={logo} 
          alt="Website Logo" 
          className="header-logo" 
          style={{ height: '500px', width: 'auto', margin: 0 }} // Resetting any default margins
        />
        <h1 className="header-title" style={{ margin: 0, fontSize: '3rem',  }}>
          SkinDex Regimen
        </h1>
      </div>
      {/* Optional: Add navigation or other items here */}
    </header>
  );
}