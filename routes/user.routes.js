const express = require('express');
const router = express.Router();
const jwtVerify = require('../middlewares/isAuth')
const userController = require('../controllers/user.controller')
const uploadImage = require('../middlewares/uploadUserImage')
const isAdmin = require("../middlewares/isAdmin");


router.get('/users/:id?', userController.getUsers);

router.post('/users', uploadImage, userController.createUser);

router.put('/users/:id', [jwtVerify , uploadImage], userController.updateUser);

router.delete('/users/:idUser',[jwtVerify, isAdmin], userController.deleteUser)

router.post('/login', userController.login)

router.get('/users/search/:search', userController.searchUser)


// Exportamos router para poder usar rutas en app.js
module.exports = router;