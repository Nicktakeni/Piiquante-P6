// Import
const passwordValidator = require('password-validator');

// Déclaration
const passwordSchema = new passwordValidator();

// Critères à respecter
passwordSchema
    .is().min(8)                                    // Minimum longueur 8
    .is().max(32)                                   // Maximum longueur 100
    .has().uppercase()                              // Doit contenir des lettres Majuscules
    .has().lowercase()                              // Doit contenir des lettres minuscules
    .has().digits(1)                                // Doit contenir au moins 1 chiffre
    .has().not().spaces()                           // Ne doit pas avoir d'espace
    .is().not().oneOf(['Passw0rd', 'Password123']); // Ces valeurs seront sur liste noire

// Exports
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(403).json({ error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate('req.body.password', { list: true })}` });
    };
}