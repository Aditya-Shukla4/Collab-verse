// client/src/App.jsx

import React from 'react';
import HomePage from '.client/pages/HomePage'; // HomePage ko import kiya
import './index.css'; // Thodi global styling ke liye

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;