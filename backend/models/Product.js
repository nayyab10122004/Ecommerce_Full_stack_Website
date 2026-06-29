const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    brand: {
      type: String,
      default: 'Generic',
    },
    features: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      enum: ['new', 'refurb', 'old', 'any'],
      default: 'new',
    },
    orders: {
      type: Number,
      default: 0,
    },
    ship: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Beauty',
        'Toys',
        'Automotive',
      ],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);