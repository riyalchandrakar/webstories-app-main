import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      console.log('📡 Player: Fetching stories...');
      const response = await axios.get('http://localhost:5000/api/stories');
      console.log('✅ Player: Stories received:', response.data);
      setStories(response.data.data || []);
      setLoading(false);
      setError('');
    } catch (error) {
      console.error('❌ Player: Error fetching stories:', error);
      setError('Failed to load stories. Make sure the backend server is running.');
      setLoading(false);
    }
  };

  const openStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const groupStoriesByCategory = () => {
    const grouped = {};
    stories.forEach(story => {
      if (!grouped[story.category]) {
        grouped[story.category] = [];
      }
      grouped[story.category].push(story);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading stories...</div>
      </div>
    );
  }

  const groupedStories = groupStoriesByCategory();

  return (
    <div className="home-container">
      <h1 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        Web Stories
      </h1>
      
      <p style={{ color: '#888', textAlign: 'center', marginBottom: '30px' }}>
        Tap on any story to start watching
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {Object.keys(groupedStories).length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '50px' }}>
          <h3>No stories available</h3>
          <p>Stories will appear here once they are created in the CMS.</p>
          <p>
            <small>
              Visit <a href="http://localhost:3000" style={{ color: '#3498db' }}>CMS Dashboard</a> to create stories
            </small>
          </p>
        </div>
      ) : (
        <div className="categories-grid">
          {Object.entries(groupedStories).map(([category, categoryStories]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="stories-grid">
                {categoryStories.map(story => (
                  <div
                    key={story._id}
                    className="story-card"
                    onClick={() => openStory(story._id)}
                  >
                    {story.slides.length > 0 && (
                      <img
                        src={story.slides[0].url}
                        alt={story.title}
                        className="story-preview"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x800/2c3e50/ffffff?text=No+Image';
                        }}
                      />
                    )}
                    <div className="story-title">{story.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {stories.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          <p>Total Stories: {stories.length}</p>
        </div>
      )}
    </div>
  );
};

export default Home;