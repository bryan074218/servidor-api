//importamos el modelo usuario
const Usuario = require('../model/Usuario');
//importamos bcryptjs para hashear los password
const bcryptjs = require('bcryptjs');
//importamos jwt para la autenticacion
const jwt = require('jsonwebtoken');
//revisamos si hay errores y para eso importamos validationResult
const {validationResult} = require('express-validator');

//exportamos la autenticaciones a nuestras rutas
exports.autenticarUsuario = async (req, res)=>{
    
    //revisamos si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }   

    //extramoe el email y el pass
    const {email, password}= req.body;

    try {
        //revisamos que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'}); 
        }
        //revisamos el pass
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'Password incorrecto'});
        }
        //si todo esta correcto crear y firmar el jwt
        const payload ={
            usuario:{
                id: usuario.id
            }
        }

        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn:3600 //1H
        },(error, token)=>{
            if(error) throw error;
            //mensaje de confirmacion
            res.json({token});
        })
        

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}