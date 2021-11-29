//importamos el modelo usuario
const Usuario = require('../model/Usuario');
//importamos bcryptjs para hashear los password
const bcryptjs = require('bcryptjs');
//importamos jwt para la autenticacion
const jwt = require('jsonwebtoken');

//revisamos si hay errores y para eso importamos validationResult
const {validationResult} = require('express-validator');



//controlador para la creaciones de usuarios
exports.crearUsuario = async(req, res)=>{

    //revisamos sino hay errores
    const errores = validationResult(req);
    
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //extramoes el email y el password
    const{email, password}= req.body;


    try {
        //revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg:'El usuario ya esta registrado'});
        }

        //crea  el nuevo usuario
        usuario = new Usuario(req.body); 

        //Hashear los password 
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardamos el nuevo usuario
        await usuario.save();

        //crear y firmar el jwt
        const payload ={
            usuario:{
                id: usuario.id
            }
        };

        //firmamos el jwt
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600
        }, (error, token)=>{
            if(error) throw error;
            //mensaje de confirmacion
            res.json({token});
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}