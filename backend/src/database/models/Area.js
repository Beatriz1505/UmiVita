'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      // Área tem muitos Sensores
      Area.hasMany(models.Sensor, { foreignKey: 'areaId', as: 'sensores' });
      // Área tem muitas Notificações
      Area.hasMany(models.Notification, { foreignKey: 'areaId', as: 'notificacoes' });
    }
  }
  Area.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: DataTypes.TEXT,
      coordenadas: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status_risco: {
        type: DataTypes.ENUM('baixo', 'medio', 'alto'),
        defaultValue: 'baixo',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Area',
      tableName: 'Areas',
      timestamps: true,
    }
  );
  return Area;
};
