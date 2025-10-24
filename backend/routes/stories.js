const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

// GET /api/stories - Get all stories
router.get('/', storyController.getAllStories);

// GET /api/stories/popular - Get popular stories
router.get('/popular', storyController.getPopularStories);

// GET /api/stories/categories - Get all categories
router.get('/categories', storyController.getCategories);

// GET /api/stories/category/:category - Get stories by category
router.get('/category/:category', storyController.getStoriesByCategory);

// GET /api/stories/:id - Get single story
router.get('/:id', storyController.getStoryById);

// POST /api/stories - Create new story
router.post('/', storyController.createStory);

// PUT /api/stories/:id - Update story
router.put('/:id', storyController.updateStory);

// PATCH /api/stories/:id/like - Like a story
router.patch('/:id/like', storyController.likeStory);

// PATCH /api/stories/:id/view - Increment story views
router.patch('/:id/view', storyController.incrementViews);

// DELETE /api/stories/:id - Delete story
router.delete('/:id', storyController.deleteStory);

// GET /api/stories/search/:query - Search stories
router.get('/search/:query', storyController.searchStories);

module.exports = router;