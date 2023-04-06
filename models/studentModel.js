module.exports =  (sequelize,DataTypes) => {
    const Student = sequelize.define("studenti", {
        ime: {
            type: DataTypes.STRING,
            /*allowNull: false,

            validate: {
                notEmpty: true
            }*/
        },
        index : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
            
    },
    {
        freezeTableName: true,
        timestamps: false
    });


    return Student;
};