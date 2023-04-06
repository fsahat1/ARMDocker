const { Sequelize } = require("./baza");


module.exports =  (sequelize,DataTypes) => {
    const Predmet = sequelize.define('predmeti', {
        /*id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },*/
        naziv: {
            type: DataTypes.STRING,
            /*allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }*/
            field: 'naziv'
        },
        brojPredavanjaSedmicno: {
            type: DataTypes.INTEGER,
            /*allowNull: false,
            validate: {
                notEmpty: true
            }*/
            field: 'brojPredavanjaSedmicno'
        },
        brojVjezbiSedmicno: {
            type: DataTypes.INTEGER,
            /*allowNull: false,
            validate: {
                notEmpty: true
            }*/
            field: 'brojVjezbiSedmicno'
        }
            
    }, 
    {
        freezeTableName: true,
        timestamps: false
    });
      
    return Predmet;
};