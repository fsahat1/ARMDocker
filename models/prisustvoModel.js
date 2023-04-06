module.exports =  (sequelize,DataTypes) => {
    const Prisustvo = sequelize.define("prisustva", {
        sedmica: {
            type: DataTypes.INTEGER,
            //allowNull: false
        },

        predavanja : {
            type: DataTypes.INTEGER
        },

        vjezbe : {
            type: DataTypes.INTEGER
        },
            
    }, 
    {
        freezeTableName: true,
        timestamps: false
    });


    return Prisustvo;
};