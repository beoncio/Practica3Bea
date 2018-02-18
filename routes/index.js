const express = require('express');
let router = express.Router();
let Tipo = require('../models/tipo');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/nuevo_inmueble', (req, res) => {
    Tipo.find().then(resultado => {
        // console.log(resultado);
        res.render('nuevo_inmueble', { error: undefined, tipos: resultado });
    }).catch(error => {
        res.render('nuevo_inmueble', { error: undefined, tipos: [] });
    });
});

router.get('/nuevo_tipo', (req, res) => {
    res.render('nuevo_tipo',{ error: undefined });
});

module.exports=router;