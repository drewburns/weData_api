"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ProjectParticipant, { foreignKey: "project_id" });
      this.hasOne(models.Query, { foreignKey: "project_id" });
      // define association here
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      owner_company_id: DataTypes.INTEGER,
      shared: DataTypes.BOOLEAN,
      share_uuid: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
