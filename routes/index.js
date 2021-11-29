//ruta para crear usuarios
const express = require('express');
const router = express.Router();
//agreamos express-validator
const {check} = require('express-validator');

//importamos nuestro controlador de usuario y autenticacion
const usuarioControllers = require('../controller/usuarioControllers');
const autenticar = require('../controller/authController');
//importamos el middleware que verifica si esta auteticado
const auth = require('../middleware/auth');
/**controladores para los proyectos */
const proyectoController = require('../controller/proyectoController');
//controlador de tareas
const tareasController = require('../controller/tareasController');


//creamos un usuario
module.exports = function(){

    router.post('/usuario',
        [
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'Agrega un email valido').isEmail(),
            check('password', 'El password tiene que ser minimo 6 caracteres').isLength({min: 6})
        ],
        usuarioControllers.crearUsuario
    );
    /**ruta para las autenticaciones */
    router.post('/auth', autenticar.autenticarUsuario);

    /**rutas para los proyectos */
    router.post('/proyectos',
      auth,
      [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
      ],
     proyectoController.crearProyecto
    );
      //obtener todo los proyectos
    router.get('/proyectos',
      auth,
      proyectoController.obtenerProyectos
    );

    //actualiza un proyecto
    router.put('/proyectos/:id',
      auth,
      [
        // check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
      ],
      proyectoController.actualizarProyecto
    )
    /**ruta para eliminar un proyecto */
    router.delete('/proyectos/:id', 
      auth,
      proyectoController.eliminarProyecto
    );

    /** Routing de las tareas */
    router.post('/tareas',
      auth,
      [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
      ],
      tareasController.crearTareas
    );

    //obtener tareas
    router.get('/tareas',
      auth,
      tareasController.obtenerProyecto
    );


    return router;

}