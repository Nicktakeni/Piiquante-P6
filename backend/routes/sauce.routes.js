const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce.controllers');
const auth = require('../middlewares/GuardAuth'); // Authentifie les pages de l'app
const multer = require('../middlewares/GuardMulter'); // Definie la destination et le nom du fichier img


router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

module.exports = router;