const dbConfig = require('../config/config');
const Sequelize = require('sequelize');


const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    } 
});

const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

db.nastavnici = require('./nastavnikModel.js')(sequelize, Sequelize.DataTypes);
db.predmeti = require('./predmetModel.js')(sequelize, Sequelize.DataTypes);
db.studenti = require('./studentModel.js')(sequelize, Sequelize.DataTypes);
db.prisustva = require('./prisustvoModel.js')(sequelize, Sequelize.DataTypes);


// foregin keyovi

// jedan nastavnik moze predavati vise predmeta
db.nastavnici.hasMany(db.predmeti, {
    //foreignKey: "nastavnik_id",
    //sourceKey: "id",
    as: 'nastavnik'
});


// jedan predmet moze imati vise prisustava odnosno objekata oblika prisustvo 
db.predmeti.hasMany(db.prisustva, {
    //foreignKey: "predmet_id",
    //sourceKey: "id",
    as: 'predmet'
});

// jedan student moze imati vise prisustava, odnosno u vise redova prisustva u tabeli
db.studenti.hasMany(db.prisustva, {
    as: 'studentindex',
    //foreignKey: "student_index",
    //sourceKey: "index",
});


db.predmeti.belongsTo(db.nastavnici);


module.exports = db;

  
