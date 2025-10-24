const Story = require('../models/Story');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching story',
      error: error.message
    });
  }
};

// @desc    Create new story
// @route   POST /api/stories
// @access  Public
const createStory = async (req, res) => {
  try {
    const { title, category, description, slides } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    // Validate slides
    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one slide is required'
      });
    }

    // Add order to slides if not provided
    const slidesWithOrder = slides.map((slide, index) => ({
      ...slide,
      order: slide.order !== undefined ? slide.order : index
    }));

    const storyData = {
      title,
      category,
      description: description || '',
      slides: slidesWithOrder
    };

    const story = new Story(storyData);
    const savedStory = await story.save();

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: savedStory
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating story',
      error: error.message
    });
  }
};

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Public
const updateStory = async (req, res) => {
  try {
    const { title, category, description, slides, isPublished } = req.body;

    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Update fields if provided
    if (title) story.title = title;
    if (category) story.category = category;
    if (description !== undefined) story.description = description;
    if (isPublished !== undefined) story.isPublished = isPublished;
    
    // Update slides if provided
    if (slides && Array.isArray(slides)) {
      const slidesWithOrder = slides.map((slide, index) => ({
        ...slide,
        order: slide.order !== undefined ? slide.order : index
      }));
      story.slides = slidesWithOrder;
    }

    story.updatedAt = Date.now();

    const updatedStory = await story.save();

    res.json({
      success: true,
      message: 'Story updated successfully',
      data: updatedStory
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating story',
      error: error.message
    });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Public
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    await Story.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
};

// @desc    Get stories by category
// @route   GET /api/stories/category/:category
// @access  Public
const getStoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const stories = await Story.findByCategory(category);

    res.json({
      success: true,
      category,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories by category',
      error: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/stories/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Story.distinct('category', { isPublished: true });
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get popular stories
// @route   GET /api/stories/popular
// @access  Public
const getPopularStories = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const stories = await Story.getPopular(parseInt(limit));

    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular stories',
      error: error.message
    });
  }
};

// @desc    Like a story
// @route   PATCH /api/stories/:id/like
// @access  Public
const likeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    await story.incrementLikes();

    res.json({
      success: true,
      message: 'Story liked successfully',
      likes: story.likes
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error liking story',
      error: error.message
    });
  }
};

// @desc    Increment story views
// @route   PATCH /api/stories/:id/view
// @access  Public
const incrementViews = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    await story.incrementViews();

    res.json({
      success: true,
      message: 'View count updated',
      views: story.views
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating view count',
      error: error.message
    });
  }
};

// @desc    Search stories
// @route   GET /api/stories/search/:query
// @access  Public
const searchStories = async (req, res) => {
  try {
    const { query } = req.params;

    const searchQuery = {
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const stories = await Story.find(searchQuery).sort('-createdAt');

    res.json({
      success: true,
      query,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching stories',
      error: error.message
    });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  getStoriesByCategory,
  getCategories,
  getPopularStories,
  likeStory,
  incrementViews,
  searchStories
};