// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomRoutes from './routes/Routes';
import MainState from './context/main/mainState';
import FeedBackBar from './components/FeedBackBar';

function App() {
  return (
    <MainState>
      <Router>
        <div className="App">
          <CustomRoutes />
        </div>
      </Router>
      <FeedBackBar />
    </MainState>
  );
}

export default App;
