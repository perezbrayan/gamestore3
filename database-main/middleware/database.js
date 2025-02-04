const { db } = require('../config/database');

const databaseMiddleware = (req, res, next) => {
    req.db = db;
    next();
};

module.exports = {
    databaseMiddleware
};
