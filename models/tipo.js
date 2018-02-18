const mongoose = require('mongoose');

let tipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
});

let Tipo = mongoose.model('tipo', tipoSchema);

module.exports = Tipo;