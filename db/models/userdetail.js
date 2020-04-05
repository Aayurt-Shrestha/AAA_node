"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserDetail = sequelize.define(
    "UserDetail",
    {
      userName: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {}
  );
  UserDetail.associate = function(models) {
    // associations can be defined here
  };
  return UserDetail;
};
