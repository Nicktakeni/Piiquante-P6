const Sauce = require('../models/sauce.models'); // Import sauce.models
const fs = require('fs'); // File system, permet de modifier/supprimer des fichiers


// Création, modification, suppression et récupération sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    const sauce = new Sauce({ // Création d'un nouvel objet sauce selon le model sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // L'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd  
        // Initialisation valeur like-dislike 0
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save() // Enregistrement de la sauce dans la bdd
        .then(() => res.status(201).json({ message: 'Sauce sauvegardée' }))
        .catch(error => res.status(400).json({ error }))
    console.log(sauce);
};

/* Controleur recuperation all sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

/* Controleur recuperation 1 sauce */
exports.getOneSauce = (req, res, next) => {
    // Recup sauce avec id
    Sauce.findOne({
        _id: req.params.id,
    })
        // Affichage sauce
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

/* Controleur suppression sauce */
exports.deleteSauce = (req, res, next) => {
    // Recup sauce avec id
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Vous n'êtes pas l'utilisateur qui à crée la sauce" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    // Suppression sauce
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

/* Controleur modification sauce */
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };

    // Recup sauce avec id
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Vous n'êtes pas l'utilisateur qui à créer la sauce." });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};


/* Controleur like dislike */
// Regle likeDislikeSauce : Like = 1 _ Dislike = -1 _ Pas de vote = 0
exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce)

            /* like d'une sauce */
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'sauce liked !' }))
                    .catch(error => res.status(400).json({ error }));
            }

            /*unlike d'une sauce */
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'sauce unliked ' }))
                    .catch(error => res.status(400).json({ error }));
            }

            /* dislike d'une sauce */
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'sauce disliked !' }))
                    .catch(error => res.status(400).json({ error }));
            }

            /* undislike d'une sauce */
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'sauce undisliked !' }))
                    .catch(error => res.status(400).json({ error }));
            }

        })
        .catch(error => res.status(500).json({ error }));


};
