const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: `Trop de tentatives erronées, veuillez réessayer dans 5 minutes.`
});

module.exports = limiter;