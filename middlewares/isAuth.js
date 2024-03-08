const jwt = require('jsonwebtoken');
const secret = 'alfabeta';

function jwtVerify(req, res, next) {
    const token =  req.headers.authorization;

    if(!token) {
        return res.status(400).send({
            ok: false,
            message: "No se proporciono token",
        })
    }

    jwt.verify(token, secret, (error, payload) => {
        // El token es incorrecto, tiene un error entonces deberiamos cortar la request/peticion y devolver una respuesta o mensaje de error
        if(error) {
            res.status(401).send({
                ok: false,
                message: "No tienes autorizacion"
            })
        }

        // El token sea correcto entonces vamos a continuar con la ejecucionde la peticion y agregar el payload a la request

        req.user = payload.user
        // Continuamos hacia el controlador(function) correspondiente
        next();
    })
}

module.exports = jwtVerify;