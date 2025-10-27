'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // Associação com User (quem gerou o relatório)
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Report.init(
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitulo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tipo: {
        type: DataTypes.ENUM('mensal', 'semanal', 'alertas', 'personalizado'),
        allowNull: false,
        defaultValue: 'mensal',
      },
      dados: {
        type: DataTypes.JSON, // Armazena os dados do relatório em JSON
        allowNull: false,
      },
      tamanho: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Report',
      tableName: 'Reports',
      timestamps: true,
    }
  );

  return Report;
};
