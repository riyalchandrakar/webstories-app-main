const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Slide type is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Media URL is required'],
    trim: true
  },
  duration: {
    type: Number,
    default: 5000,
    min: [1000, 'Duration must be at least 1000ms'],
    max: [30000, 'Duration cannot exceed 30000ms']
  },
  animation: {
    type: String,
    enum: ['fade', 'slide', 'zoom', 'none'],
    default: 'fade'
  },
  order: {
    type: Number,
    required: [true, 'Slide order is required'],
    min: 0
  },
  publicId: {
    type: String,
    default: null
  }
}, {
  timestamps: false,
  _id: true
});

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    minlength: [1, 'Title must be at least 1 character long']
  },
  category: {
    type: String,
    required: [true, 'Story category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  slides: [slideSchema],
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
storySchema.index({ category: 1, createdAt: -1 });
storySchema.index({ isPublished: 1 });
storySchema.index({ title: 'text', category: 'text' });

// Virtual for slide count
storySchema.virtual('slideCount').get(function() {
  return this.slides.length;
});

// Virtual for total duration
storySchema.virtual('totalDuration').get(function() {
  return this.slides.reduce((total, slide) => total + slide.duration, 0);
});

// Middleware to update publishedAt when isPublished changes
storySchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished) {
    this.publishedAt = new Date();
  }
  next();
});

// Static method to get stories by category
storySchema.statics.findByCategory = function(category) {
  return this.find({ category, isPublished: true }).sort({ createdAt: -1 });
};

// Static method to get popular stories
storySchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Instance method to increment views
storySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
storySchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

module.exports = mongoose.model('Story', storySchema);