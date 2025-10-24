import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    slides: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/stories/${id}`);
      setFormData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      alert('Error loading story');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          type: 'image',
          url: '',
          duration: 5000,
          animation: 'fade',
          order: prev.slides.length
        }
      ]
    }));
  };

  const updateSlide = (index, field, value) => {
    setFormData(prev => {
      const updatedSlides = [...prev.slides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        [field]: value
      };
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  };

  const removeSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/stories/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/stories', formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading story...</div>;
  }

  return (
    <div className="container">
      <h1>{isEditing ? 'Edit Story' : 'Create New Story'}</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter story title"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-control"
            placeholder="e.g., Technology, Travel, Food"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Optional story description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label>Slides *</label>
            <button type="button" onClick={addSlide} className="btn btn-success">
              Add Slide
            </button>
          </div>

          {formData.slides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
              <p>No slides added yet. Click "Add Slide" to get started.</p>
            </div>
          ) : (
            formData.slides.map((slide, index) => (
              <div key={index} className="slide-item">
                <div className="slide-header">
                  <h4>Slide {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label>Media Type</label>
                  <select
                    value={slide.type}
                    onChange={(e) => updateSlide(index, 'type', e.target.value)}
                    className="form-control"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Media URL *</label>
                  <input
                    type="url"
                    value={slide.url}
                    onChange={(e) => updateSlide(index, 'url', e.target.value)}
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <small style={{ color: '#666' }}>
                    Use high-quality images (400x800 recommended)
                  </small>
                </div>

                <div className="form-group">
                  <label>Duration (milliseconds)</label>
                  <input
                    type="number"
                    value={slide.duration}
                    onChange={(e) => updateSlide(index, 'duration', parseInt(e.target.value))}
                    className="form-control"
                    min="1000"
                    step="1000"
                  />
                  <small style={{ color: '#666' }}>
                    How long this slide should be displayed (default: 5000ms = 5 seconds)
                  </small>
                </div>

                <div className="form-group">
                  <label>Animation</label>
                  <select
                    value={slide.animation}
                    onChange={(e) => updateSlide(index, 'animation', e.target.value)}
                    className="form-control"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="actions">
          <button
            type="submit"
            disabled={saving || formData.slides.length === 0}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Story' : 'Create Story')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn"
            style={{ marginLeft: '10px', background: '#6c757d', color: 'white' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryForm;