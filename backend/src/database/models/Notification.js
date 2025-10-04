'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notificação pertence a uma Área
      Notification.belongsTo(models.Area, { foreignKey: 'areaId', as: 'area' });
    }
  }
  Notification.init(
    {
      mensagem: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nivelRisco: {
        type: DataTypes.ENUM('baixo', 'medio', 'alto'),
        defaultValue: 'baixo',
        allowNull: false,
      },
      dataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('visualizada', 'nao_visualizada'),
        defaultValue: 'nao_visualizada',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      timestamps: true,
    }
  );
  return Notification;
};
