const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = 'alfabeta'

// Obtener usuarios o un usuario en especifico
async function getUsers(req, res) {
    try {
        const id = req.params.id;

        if (id) {
            const user = await User.findById(id, { password: 0 });

            if (!user) {
                return res.status(404).send({
                    ok: false,
                    message: "No se encontró el usuario"
                });
            }

            return res.send({
                ok: true,
                user,
                message: "Usuario encontrado"
            });
        }

        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 0;

        const total = await User.countDocuments();
        const users = await User.find()
            .limit(limit)
            .skip(page * limit)
            .collation({ locale: 'es' })
            .sort({ name: 1 })
            .select({ password: 0, __v: 0 });

        if (!users.length) {
            return res.status(404).send({
                ok: false,
                message: "No se encontraron usuarios",
                total 
            });
        }

        res.send({
            ok: true,
            users,
            total,
            message: "Usuarios encontrados"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener los usuarios"
        });
    }
}

// Crear usuario
async function createUser(req, res) {

    try {
        const user = new User(req.body)

        if(req.file?.filename) {
            user.image = req.file.filename
        }

        // Encriptar contraseña
        user.password = await bcrypt.hash(user.password, saltRounds)

        // Guardamos el usuario
        const userSaved = await user.save()

        userSaved.password = undefined

        res.status(201).send({
            ok: true,
            message: "Usuario creado correctamente",
            user: userSaved
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo crear el usuario"
        })
    }

}

// Borrar usuario
async function deleteUser(req, res) {

    try {

        // Comprobar si la persona que desea borrar un usuario es ADMIN_ROLE
        if(req.user.role != "ADMIN_ROLE") return res.status(403).send({
            ok: false,
            message: "No tienes permiso para borrar usuarios"
        })
        // Checkeo si el role del usuario NO ES ADMIN no lo dejo continuar
        const id = req.params.idUser

        const userDeleted = await User.findByIdAndDelete(id)

        res.send({
            ok: true,
            message: "Usuario borrado correctamente",
            user: userDeleted
        })

    } catch (error) {
        console.log(error)
        res.send("No se pudo borrar el usuario")
    }
}

// Actualizar un usuario
async function updateUser(req, res) {

    try {

        if(req.user.role != "ADMIN_ROLE") return res.status(403).sendf({
            ok: false,
            message: "No tienes permisos",
        })
        const id = req.params.id;
        const nuevosValores = req.body;

        if(req.file?.filename) {
            nuevosValores.image = req.file.filename
        }

        const userUpdated = await User.findByIdAndUpdate(id, nuevosValores, { new: true })
        res.send({
            ok: true,
            message: "El usuario fue actualizado correctamente",
            user: userUpdated
        })

    } catch (error) {
        console.log(error)
        res.send({
            ok: false,
            message: "El usuario no se pudo actualizar"
        })
    }
}

async function login(req, res){

    try{

        // Obtener del body el email y el password
        const { password, email} = req.body

        if(!password || !email) {
            return res.status(400).send({
                ok: false,
                message: "Faltan datos"
            })
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        // Si no existe el usuario
        if(!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            })
        }

        // Si existe el usuario, comparamos la contraseña
        const verifiedUser = await bcrypt.compare(password, user.password)

        // Si la contra no es correcta
        if(!verifiedUser) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            })
        }
        
        // Realizar el login y devolvemos la respuesta correcta
        user.password = undefined;

        // Generar un #token para el usuario de tal modo que sus datos originales no puedan ser manipulados

        const token = jwt.sign( { user }, secret, {expiresIn: "1h"} )

        res.send({
            ok: true,
            message: "Login correcto",
            user,
            token
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            ok: false,
            message: "No se pudo hacer el login"
        })
    }
}

// Buscar usuarios
async function searchUser(req, res){
    try{

        const search = new RegExp(req.params.search, 'i');

        const users = await User.find({
            $or: [
                {name: search},
                {email: search}
            ]
    })

        return res.send({
            ok: true,
            message: "Usuario encontrado",
            users
        })

    } catch(error){
        console.log(error)
        res.status(500).send({
            ok: false,
            message : "No se pudo buscar el usuario"
        })
    }
}


module.exports = {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    login,
    searchUser,
} 