const { Sequelize } = require("./baza");

module.exports =  (sequelize,DataTypes) => {
    const Nastavnik = sequelize.define('nastavnici', {
        /*id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },*/
        username: {
            type: DataTypes.STRING,
            /*allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }*/
            field : 'username'
        },
        password_hash : {
            type: DataTypes.STRING,
            field: 'password_hash'
        },        
    }, 

    {
        freezeTableName: true,
        timestamps: false

    });


    return Nastavnik;
};