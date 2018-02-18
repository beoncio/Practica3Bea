const express = require('express');
const fileUpload = require('express-fileupload');
let Inmueble = require('../models/inmueble.js');
let Tipo = require('../models/tipo');
let fs = require('fs');
const mongoose = require('mongoose');

let router = express.Router();

/****************** ENRUTADORES DE LAS PETICIONES ***************/
//-------LISTAR INMUEBLES----------------------------
router.get('/', (req, res) => {
    Inmueble.find().populate('tipo').then(resultado => {
        Tipo.find().then(result => {
            res.render('listar_inmuebles', { inmuebles: resultado, tipos: result, idtipo:"undefined" });
        }).catch(error => {
            res.render('listar_inmuebles', { inmuebles: resultado, tipos: [], idtipo:"undefined"});
        });
    }).catch(error => {
        res.render('listar_inmuebles', { inmuebles: [], tipos: [], idtipo:"undefined" });
    });
});

//--------LISTAR LOS INMUEBLES POR TIPO-----------------
router.get('/tipo/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        Inmueble.find({ tipo: req.params.id }).populate('tipo').then(resultado => {
            Tipo.find().then(result => {
                res.render('listar_inmuebles', { inmuebles: resultado, tipos: result, idtipo:req.params.id });
            }).catch(error => {
                res.render('listar_inmuebles', { inmuebles: resultado, tipos: [], idtipo:req.params.id });
            });
        }).catch(error => {
            res.render('listar_inmuebles', { inmuebles: [], tipos: [], idtipo:req.params.id });
        });
    } else {
        res.status(404).render('404', { url: req.url });
    }
});

//--------FILTRAR LOS INMUEBLES POR PRECIO, SUPERFICIE, HABITACIONES-----------------
router.get('/filtrar', (req, res) => {
    let precio = req.query.precio;
    let superficie = req.query.superficie;
    let habitaciones = req.query.habitaciones;
    //console.log(req.query.precio, req.query.superficie, req.query.habitaciones);

    if (precio >=0 && superficie >=0 && habitaciones >=0) {
        let filters = {};
        req.query.precio != 0 ? filters.precio = { $lte: req.query.precio } : "";
        req.query.superficie != 0 ? filters.superficie = { $gte: req.query.superficie } : "";
        req.query.habitaciones != 0 ? filters.habitaciones = { $gte: req.query.habitaciones } : "";

        let filtros = {};
        filtros.precio=precio;
        filtros.superficie=superficie;
        filtros.habitaciones=habitaciones;
        //console.log(filtros);
        //console.log(filters);
        Inmueble.find(filters).populate('tipo').then(resultado => {
            Tipo.find().then(result => {
                res.render('filtrar_inmuebles', { inmuebles: resultado, tipos: result, idtipo:"undefined" , filtros: filtros });
            }).catch(error => {
                res.render('filtrar_inmuebles', { inmuebles: resultado, tipos: [] , idtipo:"undefined", filtros: filtros});
            });
        }).catch(error => {
            res.render('filtrar_inmuebles', { inmuebles: [], tipos: [], idtipo:"undefined", filtros: filtros});
        });
    } else {
        res.status(404).render('404', { url: req.url });
    }
});

//-------LISTAR UN INMUEBLE------------------------
router.get('/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        Inmueble.findById(req.params.id).populate('tipo').then(resultado => {
            Tipo.find().then(result => {
                res.render('ficha_inmueble', { error: false, inmueble: resultado, tipos: result });
            }).catch(error => {
                res.render('ficha_inmueble', { error: true, inmueble: resultado, tipos: [] });
            });
        }).catch(error => {
            res.render('ficha_inmueble', { error: true, tipos: [], mensajeError: "Error al buscar el inmueble" });
        });
    } else {
        res.status(404).render('404', { url: req.url });
    }
});

//-----------INSERTAR INMUEBLE-------------------------
router.post('/', (req, res) => {
    let nameFile;
    if (req.files.imagen) {
        nameFile = new Date().getTime();
        nameFile = nameFile + '.jpg';
        req.files.imagen.mv('public/uploads/' + nameFile, error => {
            if (error) {
                // console.log(err);
                res.status(500).send("Error subiendo el archivo", error);
            }
            // res.send("Archivo subido");
        });
    } else
        nameFile = 'imagenCasa.jpg'; //Imagen por defecto

    let nuevoInmueble = new Inmueble({
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        habitaciones: req.body.habitaciones,
        superficie: req.body.superficie,
        precio: req.body.precio,
        imagen: nameFile
    });
    nuevoInmueble.save().then(resultado => {
        Tipo.find().then(result => {
            res.render('ficha_inmueble', { error: false, inmueble: resultado, tipos: result });
        }).catch(error => {
            res.render('ficha_inmueble', { error: false, inmueble: resultado, tipos: [] });
        });
    }).catch(errorMsg => {
        // console.log("error:",errorMsg);
        res.render('nuevo_inmueble', { error: true, tipos: [], mensajeError: errorMsg });
    });
});

//-----------BORRAR UN INMUEBLE-------------------------
router.delete('/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        Inmueble.findByIdAndRemove(req.params.id).then(resultado => {
            if (resultado.imagen != 'imagenCasa.jpg' && fs.existsSync('public/uploads/' + resultado.imagen)) {
                fs.unlink('public/uploads/' + resultado.imagen, () => null);
            }
            res.send({ error: true, resultado: resultado });
        }).catch(error => {
            res.send({
                error: false,
                resultado: error
            });
        });
    } else {
        res.status(404).render('404', { url: req.url });
    }
});

module.exports = router;