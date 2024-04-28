const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TotalMessage extends Model {}
  TotalMessage.init({
    // user_id: DataTypes.INTEGER,
    // message_id: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TotalMessage',
  });
  return TotalMessage
};
