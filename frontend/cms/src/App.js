import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StoryForm from './components/StoryForm';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-story" element={<StoryForm />} />
            <Route path="/edit-story/:id" element={<StoryForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;