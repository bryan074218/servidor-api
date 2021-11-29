const mongoose = require('mongoose');

const proyectoSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        require: true,
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    },
    creado:{ 
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);