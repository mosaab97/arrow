// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomRoutes from './routes/Routes';
import MainState from './context/main/mainState';

function App() {
  return (
    <MainState>
      <Router>
        <div className="App">
          <CustomRoutes />
        </div>
      </Router>
    </MainState>
  );
}

export default App;
