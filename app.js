const express = require('express');
const app = express();
const cors = require('cors');


const userRoutes = require("./routes/user.routes")
const categoryRoutes = require("./routes/category.routes")
const productRoutes = require("./routes/product.routes")
const orderRoutes = require("./routes/order.routes")
// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

//Compartir carpeta public
app.use(express.static('public'));

// Aplicamos o integramos las rutas a nuestros servidor
app.use([
    userRoutes,
    categoryRoutes,
    productRoutes,
    orderRoutes
])

module.exports = app;