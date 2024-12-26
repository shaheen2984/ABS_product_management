const { DataTypes } = require('sequelize');
const sequelize = require('./config');

const User  = sequelize.define('user', {
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  Active: { type: DataTypes.INTEGER, allowNull: false },
});

const Category = sequelize.define('category', {
  category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  Active: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: true }, 
});

const Product = sequelize.define('product', {
  product_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  Active: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: true }, 
});

//Relationships
User.hasMany(Category, { foreignKey: 'user_id' });
Category.belongsTo(User);

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category);

module.exports = { User, Category, Product, sequelize };


