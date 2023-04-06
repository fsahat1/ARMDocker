

// sluzi mi samo za drzanje podataka o bazi
module.exports = {
    HOST: 'mysql-db',
    USER: 'root',
    PASSWORD: 'password',
    DATABASE: 'wt22',
    DIALECT: 'mysql',
    PORT: '3306',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    } 
}