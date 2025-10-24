import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://webstories-app-main.onrender.com/api/stories';

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  // Fetch all stories
  const fetchStories = async () => {
    try {
      console.log('📡 Fetching stories from API...');
      const response = await axios.get(API_BASE);
      console.log('✅ Stories received:', response.data);
      setStories(response.data.data || []);
      setLoading(false);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching stories:', err);
      setError('Failed to load stories. Make sure the backend server is running and endpoint exists.');
      setLoading(false);
    }
  };

  // Create sample/test stories
  const createTestStories = async () => {
    try {
      console.log('🔄 Creating test stories...');
      const testStories = [
        {
          title: "Amazing Tech Innovations 2024",
          category: "Technology",
          slides: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=800&fit=crop",
              duration: 5000,
              animation: "fade",
              order: 0
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=800&fit=crop",
              duration: 5000,
              animation: "slide",
              order: 1
            }
          ]
        },
        {
          title: "Beautiful Beaches Around World",
          category: "Travel",
          slides: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=800&fit=crop",
              duration: 5000,
              animation: "fade",
              order: 0
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=800&fit=crop",
              duration: 5000,
              animation: "zoom",
              order: 1
            }
          ]
        },
        {
          title: "Healthy Cooking Tips & Recipes",
          category: "Food",
          slides: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=800&fit=crop",
              duration: 5000,
              animation: "fade",
              order: 0
            }
          ]
        }
      ];

      for (const story of testStories) {
        await axios.post(API_BASE, story);
        console.log('✅ Created story:', story.title);
      }

      alert('🎉 Test stories created successfully!');
      fetchStories(); // Refresh the list
    } catch (err) {
      console.error('❌ Error creating test stories:', err);
      alert('Error creating test stories. Check console for details.');
    }
  };

  // Delete story
  const deleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchStories();
    } catch (err) {
      console.error('❌ Error deleting story:', err);
      alert('Error deleting story. Check console.');
    }
  };

  if (loading) {
    return <div className="container loading">Loading stories...</div>;
  }

  return (
    <div className="container">
      {/* Header */}
      <div
        className="header-actions"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <h1>Web Stories Dashboard</h1>
        <div>
          <button onClick={createTestStories} className="btn btn-test">
            Create Test Stories
          </button>
          <Link to="/add-story" className="btn btn-primary">
            Add New Story
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error" style={{ marginBottom: '15px', color: 'red' }}>
          {error}
        </div>
      )}

      {/* Stories Table */}
      <div className="stories-table">
        <div className="table-header" style={{ display: 'flex', fontWeight: 'bold', gap: '10px', padding: '10px 0' }}>
          <div style={{ flex: 2 }}>Title</div>
          <div style={{ flex: 1 }}>Category</div>
          <div style={{ flex: 1 }}>Created Date</div>
          <div style={{ flex: 1 }}>Actions</div>
        </div>

        {stories.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No stories found</h3>
            <p>Create your first story or click "Create Test Stories" to add sample data.</p>
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story._id}
              className="table-row"
              style={{
                display: 'flex',
                gap: '10px',
                padding: '10px 0',
                borderBottom: '1px solid #ddd',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 2 }}>
                <strong>{story.title}</strong>
                <br />
                <small>{story.slides?.length || 0} slides</small>
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {story.category}
                </span>
              </div>
              <div style={{ flex: 1 }}>{new Date(story.createdAt).toLocaleDateString()}</div>
              <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                <Link to={`/edit-story/${story._id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button onClick={() => deleteStory(story._id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {stories.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          <p>Total Stories: {stories.length}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
