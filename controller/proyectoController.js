//importamos el modelo del proyecto
const Proyecto = require('../model/Proyectos');
//revisamos si hay errores y para eso importamos validationResult
const {validationResult} = require('express-validator');
const { json } = require('express');

//midellware para la creacion de proyectos
exports.crearProyecto = async(req,res)=>{

    //revisamos si hay errores
    const errores = validationResult(req);
    
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }


    try {
        //creamos un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //guardar creador  via jwt
        proyecto.creador = req.usuario.id
        //guardamos el proyecto
        proyecto.save();
        //mensaje de confirmacion
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
/**obtiene todo los proyectos del usuario actual */
exports.obtenerProyectos = async (req, res)=>{
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}

/**actualizacion de un proyecto */
exports.actualizarProyecto = async (req, res)=>{
    
    //revisamos si hay errores
    
    const errores = validationResult(req);
    
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //extraemos la info. del proyecto
    const {nombre}=req.body;
    const nuevoProyecto ={};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    } 

    try {

        //revisar el ID
        let proyectos = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyectos){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyectos.creador.toString()!== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'});
        }

        //actualizar
        proyecto = await Proyecto.findOneAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});
        res.json({proyecto});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}
/**Eliminar un proyecto de la DB */
exports.eliminarProyecto = async (req, res)=>{
    try {
          //revisar el ID
          let proyectos = await Proyecto.findById(req.params.id);

          //si el proyecto existe o no
          if(!proyectos){
              return res.status(404).json({msg:'Proyecto no encontrado'});
          }
  
          //verificar el creador del proyecto
          if(proyectos.creador.toString()!== req.usuario.id){
              return res.status(401).json({msg:'No autorizado'});
          }
          //elliminamos el proyecto
          await Proyecto.findOneAndRemove({_id: req.params.id});
          res.json({msg: 'Elimiando correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor')
    }
}