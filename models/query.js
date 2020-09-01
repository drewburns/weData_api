"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: "project_id" });
      this.hasMany(models.Column, {
        foreignKey: "query_id",
        onDelete: "cascade",
      });
    }
  }
  Query.init(
    {
      name: DataTypes.STRING,
      link: DataTypes.STRING,
      p_key: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Query",
    }
  );
  return Query;
};
