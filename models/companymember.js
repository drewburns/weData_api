"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CompanyMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Company, { foreignKey: "company_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  CompanyMember.init(
    {
      user_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CompanyMember",
    }
  );
  return CompanyMember;
};
