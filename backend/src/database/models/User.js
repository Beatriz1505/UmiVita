'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // No momento, sem relacionamentos extras para User
    }
  }
  User.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senhaHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      perfil: {
        type: DataTypes.ENUM('admin', 'usuario'),
        defaultValue: 'usuario',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );
  return User;
};
