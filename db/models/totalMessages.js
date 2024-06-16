const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TotalMessage extends Model {}
  TotalMessage.init({
    total: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TotalMessage',
  });
  return TotalMessage
};
