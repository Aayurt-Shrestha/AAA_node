"use strict";
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue("password");
        }
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue("salt");
        }
      }
    },
    {}
  );
  User.prototype.correctPassword = function(candidatePwd) {
    return User.encryptPassword(candidatePwd, this.salt()) === this.password();
  };
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.UserDetail, {
      foreignkey: "userId",
      onDelete: "CASCADE"
    });
    User.hasOne(models.DbaRole, {
      foreignkey: "userId",
      onDelete: "CASCADE"
    });
  };

  //Salt should be random and is used for frequend password changes
  //Salt value is also saved in the database
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString("base64");
  };
  //the password is encrypted with Hash of combo of password and salt
  User.encryptPassword = function(plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  };
  //Here, the salt and password is set in db in before create & update
  const setSaltAndPassword = user => {
    if (user.changed("password")) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  };
  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);
  User.beforeBulkCreate(users => {
    users.forEach(setSaltAndPassword);
  });
  return User;
};
