"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Company, { foreignKey: "company_id" });
      this.belongsTo(models.User, { foreignKey: "creating_user_id" });
      this.hasMany(models.Query, { foreignKey: "template_id" });
    }
  }
  Template.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      link: DataTypes.STRING,
      primary_key: DataTypes.STRING,
      creating_user_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Template",
    }
  );
  return Template;
};
