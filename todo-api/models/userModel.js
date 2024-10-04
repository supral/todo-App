const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Compare hashed password
User.prototype.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
