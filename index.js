const server = require('./app')
const mongoose = require('mongoose');

(async function main() {
    try {
        // Nos conectamos a la base de datos
        await mongoose.connect("mongodb+srv://Martinman:1LzDt2RSe2wK2BwP@eit-64910.acztsou.mongodb.net/ecommerce")
        console.log("Conexion a la db correcta")

        // Ponmos nuestro servidor express a escuchar
        server.listen(3000, () => {
            console.log('Server is running at port 3000')
        })

    } catch (error) {
        console.log(error)
    }
})()






