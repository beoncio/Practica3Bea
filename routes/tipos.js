const express = require('express');
const fileUpload=require('express-fileupload');
let Tipo = require('../models/tipo');
let fs = require('fs');

let router = express.Router();

router.get('/', (req, res) => {
    Tipo.find().then(resultado => {
        res.send({tipos:resultado});
    }).catch(error => {
        res.send({tipos:[]});
    });
});

router.post('/', (req, res) => { 
    let nuevoTipo = new Tipo({
        nombre: req.body.nombre
    });
    console.log('body',req.body);
    nuevoTipo.save().then(resultado => {
        res.send({error:false, tipos:resultado});
    }).catch(error => {
        console.log("error:",error);
        res.send({ error:true, tipos:[], mensajeError:"Error al insertar el tipo"});
    });
});

module.exports=router;