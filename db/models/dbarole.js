"use strict";
module.exports = (sequelize, DataTypes) => {
  const DbaRole = sequelize.define(
    "DbaRole",
    {
      role: DataTypes.STRING,
      roledescription: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {}
  );
  DbaRole.associate = function(models) {
    // associations can be defined here
  };
  return DbaRole;
};
