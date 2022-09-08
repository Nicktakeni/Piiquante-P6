// Import d'Express
const express = require('express');

// Accès à la req
app.use(express.json());

// Import de mongoDB
const mongoose = require('mongoose');

// Import du package body-parser (parse automatiquement les requêtes en JSON)
const bodyParser = require('body-parser');

// Import des routes (CRUD)
const sauceRoutes = require('./routes/sauce');

// Import des routes utilisateur
const userRoutes = require('./routes/user');

// Mise en place du chemin d'accès à un fichier téléchargé par l'utilisateur
const path = require('path');

// Reponse simple afin de verif que tout marche correctement
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;

// Ajout des Middlewares d'autorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Middleware de gestion d'image
app.use('/images', express.static(path.join(__dirname, 'images')));

//Gestion des routes utilisateurs
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);