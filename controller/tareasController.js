const Tareas = require('../model/Tareas');
const Proyecto = require('../model/Proyectos');
const {validationResult} = require('express-validator');

//creamos una nueva tarea
exports.crearTareas = async(req, res)=>{

    //revisamos si hay errores
    const errores = validationResult(req);
    
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    
    

    try {
        //extraemos el proyecto y comprobar si existe
        const {proyecto}= req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        //sino hay ningun proyecto
        if(!existeProyecto){
            res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar si el proyecto actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'});
        }

        //creamos la tarea
        const tarea = new Tareas(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }

}

//obtener todo los proyectos
exports.obtenerProyecto = async(req, res)=>{
    try {
         //extraemos el proyecto y comprobar si existe
        const {proyecto}= req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        //sino hay ningun proyecto
        if(!existeProyecto){
            res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar si el proyecto actual pertence al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'});
        }

        //obtener las tareas
        const tareas = await Tareas.find({proyecto});
        res.json(tareas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}