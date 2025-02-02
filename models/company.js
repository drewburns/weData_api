"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Company.hasMany(CompanyMember);
      this.hasMany(models.CompanyMember, { foreignKey: "company_id" });
      this.hasMany(models.Template, { foreignKey: "company_id" });
      this.hasMany(models.ProjectParticipant, { foreignKey: "project_id" });
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  return Company;
};
