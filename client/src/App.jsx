// client/src/App.jsx

import React from 'react';
// Purane HomePage ki jagah, ab hum apne naye Receptionist ko import kar rahe hain
import AppRouter from './routes/AppRouter'; 
import './styles/global.css'; // Global styles ko import kar rahe hain

function App() {
  return (
    <div className="App">
      {/* Ab App component sirf ek kaam kar raha hai: AppRouter ko render karna */}
      <AppRouter /> 
    </div>
  );
}

export default App;