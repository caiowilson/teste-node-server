const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const db = {};

db.mongoose = mongoose;

//TODO adiciuonar nos controllers 
//?routes e middlewares
const modelsPath = path.resolve(__dirname)
fs.readdirSync(modelsPath).forEach(file => {
    if(!file.startsWith('index'))
        db[file.split('.')[0]] = require(modelsPath + '/' + file);
})

db.ROLES = ["user", "admin"];

module.exports = db;