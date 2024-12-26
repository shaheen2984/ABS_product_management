const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const { User, Category, Product } = require('./model');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(bodyParser.json());

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Routes Creating
app.get('/', (req, res) => res.send('Welcome to the API'));

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, User ${req.user.id}! You are authenticated.` });
});

// user Registration
app.post('/auth/register', async (req, res) => {
    try {
      
      const { user_name, email, password, Active } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ user_name, email,Active, password: hashedPassword });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Login for user route to generate a JWT
app.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  //Category add and insert

  app.post('/categories', authMiddleware, async (req, res) => {
    try {
      const category = await Category.create({ category_name: req.body.category_name, Active: req.body.Active, user_id: req.user.id });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get Categories
  app.get('/categories', authMiddleware, async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: { user_id: req.user.id }, 
      });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


  // Delete category
app.delete('/categories/:category_id', authMiddleware, async (req, res) => {
    const categoryId = req.params.category_id;
    const userId = req.user.id; 
    
    try {
      const category = await Category.findOne({ where: { category_id: categoryId, user_id: userId } });
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found or does not belong to the user' });
      }

      await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create and Insert Products Details 
app.post('/products', authMiddleware, async (req, res) => {
    try {
      const category = await Category.findOne({
        where: { category_id: req.body.category_id, user_id: req.user.id },
      });
      if (!category) return res.status(404).json({ message: 'Category not found' });
  
      const product = await Product.create({ ...req.body });
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
 

  //Get products Details
  app.get('/products', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { user_id: req.user.id }, 
          });

          
          console.log('Fetched Categories:', categories);
          if (!categories || categories.length === 0) 
            return res.status(404).json({ message: 'Category not found' });

          const categoryIds = categories.map((category) => category.dataValues.category_id);
    const products = await Product.findAll({
       where: { category_id: categoryIds  },
    });
    res.json(products);
   } catch (error) {
          console.error('Error fetching products:', error.message);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
  });


  app.delete('/products/:product_id', authMiddleware, async (req, res) => {
    try {

        const categories = await Category.findAll({
            where: { user_id: req.user.id }, 
          });
          
          console.log('Fetched Categories:', categories);
          if (!categories || categories.length === 0) 
            return res.status(404).json({ message: 'Category not found' });

          const categoryIds = categories.map((category) => category.dataValues.category_id);
        const product = await Product.findOne({
            where: { category_id: categoryIds  },
      });
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      await product.destroy();
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
// Run and start server
(async () => {
  try {
    
 app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})()