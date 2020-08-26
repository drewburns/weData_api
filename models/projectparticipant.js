"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Project, { foreignKey: "project_id" });
      this.belongsTo(models.Company, { foreignKey: "company_id" });
      // define association here
    }
  }
  ProjectParticipant.init(
    {
      project_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
      admin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProjectParticipant",
    }
  );
  return ProjectParticipant;
};
