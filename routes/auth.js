/*maneja la autenticación y proporciona un endpoint para obtener un token
Este código se encarga de recibir solicitudes, procesarlas para obtener un token y enviar una respuesta al cliente, todo de manera organizada y controlada*/
const express = require('express');
const { getPublicToken } = require('../services/aps.js');

let router = express.Router();

router.get('/api/auth/token', async function (req, res, next) {
    try {
        res.json(await getPublicToken());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
