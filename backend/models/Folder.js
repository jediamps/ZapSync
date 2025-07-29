const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const { checkForProfanity } = require('../services/contentFilter');

const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Folder name cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Folder name must be between 1 and 255 characters'
      },
      async isNotProfane(value) {
        if (await checkForProfanity(value)) {
          throw new Error('Folder name contains inappropriate language');
        }
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Folder,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['name', 'parentId', 'ownerId']
    }
  ]
});

// Relationships
Folder.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Folder.belongsTo(Folder, { foreignKey: 'parentId', as: 'parent' });
Folder.hasMany(Folder, { foreignKey: 'parentId', as: 'children' });

module.exports = Folder;