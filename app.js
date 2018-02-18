const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inmuebles = require('./routes/inmuebles');
const tipos =require('./routes/tipos');
const index = require('./routes/index');
const fileUpload=require('express-fileupload');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/inmuebles');


let app=express();

app.set('view engine', 'ejs');

app.use(fileUpload()); //también hace de body parser procesa los datos que llegan del formulario
// app.use(bodyParser.json());//cada petición que llegue al servidor desde el cliente lo va a parsear a json con este middleware
// app.use(bodyParser.urlencoded({extended:false}));

app.use("/", express.static('./public'));//todas las peticiones que sean estáticas las sirves en public

app.use('/inmuebles', inmuebles);
app.use('/tipos', tipos);
app.use('/', index);

app.use((req, res, next) => {
    res.status(404);
    res.render('404', { url: req.url });
});

app.listen(8080);