const { trusted } = require("mongoose");
const Product = require("../models/product.model")

async function getProducts(req, res) {
    try{

        const products = await Product.find()
        
        return res.status(200).send({
            ok: true,
            products
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener los productos",
        })
    }
}

async function createProduct(req, res) {
    try {

        const product = new Product(req.body)
        
        if(req.file?.filename) {
            product.image = req.file.filename
        }

        const productDB = await product.save()
        
        return res.status(200).send({
            ok: true,
            message: "Producto creado correctamente",
            product: productDB
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear el producto",
        })
    }
}

async function updateProduct(req, res) {
    try {

        const id = req.params.id
        const body = req.body

        if(req.file?.filename) {
            body.image = req.file.filename
        }

        const product = await Product.findById(id);
        if(!product){
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado",
            })
        }


        const updatedProduct = await Product.findByIdAndUpdate(id, body, {new: true})

        return res.status(200).send({
            ok: true,
            message: "Producto axtualizado correctamente",
            product: updatedProduct
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al actualizar el producto",
        })
    }
}

async function deleteProduct(req, res) {
    try{

        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado",
            })
        }

        return res.status(200).send({
            ok: true,
            message: "Producto eliminado correctamente",
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al borrar el producto",
        })
    }
}

async function searchProduct(req, res){
    try{

        const search = new RegExp(req.params.search, 'i');

        const products = await Product.find({
            $or: [
                {name: search},
            ]
    })

        return res.send({
            ok: true,
            message: "Producto encontrado",
            products
        })

    } catch(error){
        console.log(error)
        res.status(500).send({
            ok: false,
            message : "No se pudo buscar el producto"
        })
    }
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
};