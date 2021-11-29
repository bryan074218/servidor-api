const mongoose = require('mongoose');

const tareaSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        require: true
    },
    estado:{
        type: Boolean,
        default: false
    },
    fecha:{
        type: Date,
        default: Date.now()
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Proyecto'
    }
});

module.exports = mongoose.model('Tarea', tareaSchema);