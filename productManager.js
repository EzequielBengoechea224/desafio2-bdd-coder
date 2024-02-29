const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.id = 1;
        this.products = [];
        this.path = path;
    }

    async addProduct(title, desc, price, thumbnail, code, stock) {
        try {
            const nuevoProd = {
                id: this.id,
                title: title,
                description: desc,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };

            this.products.find((prod) => prod.code === code) ? console.error("Ya existe un producto con ese código") : this.products.push(nuevoProd);
            this.id += 1;

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            console.log("El producto fue agregado con éxito!!");
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts() {
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            if (productos.length > 0) {
                productos = JSON.parse(productos);
                return productos;
            } else {
                console.error("Todavía no hay ningún producto agregado");
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    }
    //Busco productos basandome en su id y los muestro
    async getProductById(id) {
        try {
            console.log("Buscando por ID");
            this.products = await this.getProducts();
            let prodEncontrado = this.products.find((prod) => prod.id === id);
            if (prodEncontrado) {
                return prodEncontrado;
            } else {
                return console.warn("El producto solicitado no fue encontrado, probablemente no existe");
            }
        } catch (error) {
            console.error(error);
        }
    }
    //Metodo para modificar un producto Basandose en su ID
    async updateProduct(id, valor) {
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            productos = JSON.parse(productos);

            const productoIndex = productos.findIndex((producto) => producto.id === id);

            if (productoIndex !== -1) {
                productos[productoIndex] = {
                    ...productos[productoIndex],
                    ...valor
                };
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
                console.log("El producto se modificó de forma exitosa!");
            } else {
                console.error("No se encontró ningún producto con ese ID");
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Metodo para eliminar productos basandose en su ID
    async deleteProduct(id){
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            productos = JSON.parse(productos);

            const productoIndex = productos.findIndex(producto => producto.id === id);

            if (productoIndex !== -1) {
                productos.splice(productoIndex, 1);

                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));

                console.log("El producto fue eliminado con éxito!");
            } else {
                console.error("No se encontró ningún producto con el ID especificado");
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const main = async () => {
    //instancio la clase ProductManager
    const productos = new ProductManager("products.json");
    console.log(productos);

    //añado productos (tira error al querer cargar un producto con el mismo codigo)
    await productos.addProduct("pampa", "arbol", 20, "img", 123, 2);
    await productos.addProduct("gallo", "clau", 20, "img", 223, 2);

    //Muestro los productos cargados
    let prod = await productos.getProducts();
    console.log(prod);

    //Busco producto por id

    let ProdID = await productos.getProductById(2);
    console.log(ProdID);

    //Modifico los productos
    const valor = {
        title: "Remera ultra tilteante",
        price: 30,
        stock: 15,
    };
    await productos.updateProduct(1, valor);

    //Muestro los productos modificados
    prod = await productos.getProducts();
    console.log(prod);

    //Elimino el producto de ID 1 y lo vuelvo a mostrar
    await productos.deleteProduct(1);

    //Muestro los productos modificados
    prod = await productos.getProducts();
    console.log(prod);
}

main();