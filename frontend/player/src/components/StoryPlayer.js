import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoryPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stories/${id}`);
      setStory(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (story && currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      navigate('/');
    }
  }, [currentSlideIndex, story, navigate]);

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else {
      navigate('/');
    }
  }, [currentSlideIndex, navigate]);

  useEffect(() => {
    if (!story || story.slides.length === 0) return;

    const currentSlide = story.slides[currentSlideIndex];
    const timer = setTimeout(nextSlide, currentSlide.duration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, story, nextSlide]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      previousSlide();
    } else if (e.key === 'Escape') {
      navigate('/');
    }
  }, [nextSlide, previousSlide, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (loading) {
    return (
      <div className="story-player">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: 'white'
        }}>
          Loading story...
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-player">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: 'white'
        }}>
          Story not found
        </div>
      </div>
    );
  }

  const currentSlide = story.slides[currentSlideIndex];

  return (
    <div className="story-player">
      <div className="player-header">
        <div style={{ flex: 1 }}>
          <div className="progress-bars">
            {story.slides.map((_, index) => (
              <div key={index} className="progress-bar">
                <div
                  className={`progress-fill ${index <= currentSlideIndex ? 'active' : ''}`}
                  style={{
                    animationDuration: `${story.slides[index].duration}ms`,
                    animationPlayState: index === currentSlideIndex ? 'running' : 'paused'
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ color: 'white', fontSize: '1.1rem' }}>
            {story.title} - {currentSlideIndex + 1}/{story.slides.length}
          </div>
        </div>
        <button className="close-btn" onClick={() => navigate('/')}>
          ✕
        </button>
      </div>

      <div className="story-content">
        {currentSlide.type === 'image' ? (
          <img
            src={currentSlide.url}
            alt={`Slide ${currentSlideIndex + 1}`}
            className={`slide-media image ${currentSlide.animation}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x800/2c3e50/ffffff?text=Image+Not+Found';
            }}
          />
        ) : (
          <video
            src={currentSlide.url}
            className={`slide-media video ${currentSlide.animation}`}
            autoPlay
            muted
            onEnded={nextSlide}
            controls={false}
          />
        )}
      </div>

      <div className="navigation">
        <div className="nav-left" onClick={previousSlide} />
        <div className="nav-right" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default StoryPlayer;