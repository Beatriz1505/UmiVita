'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HistoricalData extends Model {
    static associate(models) {
      // Dados Históricos pertencem a um Sensor
      HistoricalData.belongsTo(models.Sensor, { foreignKey: 'sensorId', as: 'sensor' });
    }
  }
  HistoricalData.init(
    {
      dataHora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      temperatura: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      umidade: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      nivel_contaminacao: {
        type: DataTypes.ENUM('baixo', 'medio', 'alto'),
        allowNull: true,
        defaultValue: 'baixo',
      },
    },
    {
      sequelize,
      modelName: 'HistoricalData',
      tableName: 'HistoricalData',
      timestamps: true,
    }
  );
  return HistoricalData;
};
