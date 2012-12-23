module.exports = function(sequelize, DataTypes) {
  return sequelize.define("users", {
    'id': { 
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    'name': DataTypes.STRING,
    'first_name': DataTypes.STRING,
    'last_name': DataTypes.STRING,
    'email': DataTypes.STRING,
    'access_token': DataTypes.STRING,
    'timezone': DataTypes.STRING,
    'locale': DataTypes.STRING,
    'provider': DataTypes.STRING,
    'provider_id': DataTypes.INTEGER,
    'joined_at': DataTypes.DATE,
    'last_login': DataTypes.DATE
  });
};