'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stickers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stickers.init({
    file_id: DataTypes.TEXT,
    send_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stickers',
  });
  return Stickers;
};
