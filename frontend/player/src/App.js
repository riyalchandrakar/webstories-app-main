import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StoryPlayer from './components/StoryPlayer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story/:id" element={<StoryPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;