const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const frontendPath = 'C:\\Users\\user\\Desktop\\ecommerce full stack website\\frontend';
const imagesPath = path.join(__dirname, 'images');

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('📨', req.method, req.url);
  next();
});

app.use('/images', express.static(imagesPath));

app.use(express.static(frontendPath));

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: `Route ${req.url} not found` });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopverse')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📸 Images: http://localhost:${PORT}/images/headphone.png`);
});