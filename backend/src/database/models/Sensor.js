'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {
    static associate(models) {
      // Sensor pertence a uma Área
      Sensor.belongsTo(models.Area, { foreignKey: 'areaId', as: 'area' });
      // Sensor tem muitos Dados Históricos
      Sensor.hasMany(models.HistoricalData, { foreignKey: 'sensorId', as: 'historicos' });
    }
  }
  Sensor.init(
    {
      tipo: {
        type: DataTypes.ENUM('temperatura', 'umidade'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Sensor',
      tableName: 'Sensors',
      timestamps: true,
    }
  );
  return Sensor;
};
