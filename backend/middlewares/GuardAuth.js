const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // On récupère le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On le vérifie
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        if (req.body.userId && req.body.userId !== userId) { // On compare son id avec l'userId
            throw 'User id non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Requête non authentifiée !') });
    }
};


