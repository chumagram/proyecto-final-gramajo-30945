const Contenedor = require('../../contenedores/ContenedorSQLite');
const SqLiteOptions = require('../../data/dbSql/config.js');

class Carrito extends Contenedor {
    constructor(options, tableName){
        super(options, tableName);
    }

    // CREATE NEW CART
    async createCart(){
        try {
            let cartToAdd = {};
            let created = await this.createSQL(cartToAdd);
            return { hecho: `carrito con id ${created} creado con éxito`};
        } catch (error) { 
            return { error: `ERROR al crear el carrito: ${error}`};
        }
    }

    // READ CART
    async readCart(idCarrito){
        let cartAux = await this.readSQL({id: idCarrito});
        if (cartAux.id){
            return cartAux;
        } else if (cartAux.error){
            return { error: "carrito no encontrado"};
        }
    }

    //! UPDATE ADD TO CART
    async addToCart(idProducto,idCart){
        let productToAdd = await product.readSQL({id: idProducto});
        let cartList, flagCarrito = true, auxList = [];
        // TRAE TODOS LOS CARRITOS
        try {
            cartList = this.readAll();
        } catch(error) {
            return { error:`Falló la lectura de los carritos: ${error}`};
        }
        // RECORREMOS LA LISTA DE CARRITOS
        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                if (carrito.listaP) auxList = carrito.listaP;
                let flag = true;
                // RECORREMOS LA LISTA DE PRODUCTOS EN EL CARRITO
                auxList.forEach(producto => {
                    if (producto.id == productToAdd.id) {
                        producto.quantity+=1;
                        flag = false;
                    }
                });

                // SI EL PRODUCTO NO ESTABA EN EL CARRITO - TRUE
                if (flag){
                    productToAdd.quantity = 1;
                    if (productToAdd.stock){
                        delete productToAdd.stock
                        delete productToAdd.timeStamp
                    }
                    auxList.push(productToAdd);
                }

                cartUpdated = Object.assign(carrito, { listaP: auxList });
                flagCarrito = false;
            }
        });

        if (productToAdd.error){
            return productToAdd.error
        }else if (flagCarrito){
            return { error:`Carrito ${idCart} no encontrado`}
        } else {
            try {
                let updated =  await this.updateSQL({id: idCart},cartUpdated);
                if (updated.error) {
                    return { error:`Falla al actualizar el producto en el carrito: ${error}`}
                } else {
                    return { hecho: `Producto añadido al carrito ${idCart} exitosamente`}
                }
            } catch(error) {
                return { error:`Falla al añadir el producto al carrito: ${error}`}
            }
        }
    }

    //! UPDATE DELETE PRODUCT FROM CART
    async deleteFromCart(idProducto, idCart){
        let cartList = this.readAll();
        let flagProduct = true;
        let flagNoCart = true;
        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                flagNoCart = false;
                let indexProduct = carrito.listaP.findIndex(producto => producto.id === idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagProduct = false;
                } else {
                    carrito.listaP.forEach(producto => {
                        if(producto.id == idProducto){
                            if(producto.quantity > 1){
                                producto.quantity--;
                            } else if (producto.quantity = 1) {
                                carrito.listaP.splice(indexProduct, 1);
                            }
                        }
                        cartUpdated = carrito;
                    });
                }
            }
        });

        if (!flagProduct) {
            return {error:`Error: Producto ${idProducto} no encontrado en el carrito`}
        } else if (flagNoCart){
            return {error:`Error: El carrito ${idCart} no existe`}
        } else {
            try {
                this.updateDocument(idCart,cartUpdated)
                return { hecho: 'ATENCIÓN: producto eliminado del carrito' };
            } catch(error) {
                return { error: "ERROR al eliminar el producto del carrito" };
            }
        }
    }

    //! UPDATE DELETE ALL THE PRODUCTS FROM CART
    async deleteAllFromCart(idCart){
        let cartList = this.readAll();
        let flag = true;
        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                carrito.listaP = [];
                flag = false
                cartUpdated = carrito;
            }
        });

        if (flag){
            return {Error: "Carrito no encontrado"}
        } else {
            try {
                this.updateById(idCart,cartUpdated);
                return {Hecho: `ATENCIÓN: todos los productos eliminados del carrito ${idCart}`};
            } catch(error) {
                return {Error: `Falló eliminar la lista de productos del carrito ${idcart}`};
            }
        }
    }

    //! DELETE CART
    async deleteCart(idCart){
        try {
            let retorno = this.deleteDocument(idCart);
            return retorno;
        } catch (error) {
            return {Error: `Falló eliminar el carrito ${idCart}: ${error}`};
        }
    }
}

let changuito = new Carrito(SqLiteOptions,'carritos');

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//changuito.createCart().then((res) => console.log(res));

//RPUEBA DE MODULO QUE MUESTRA TODOS LOS PRODUCTOS EN UN CARRITOS
//changuito.readCart(1).then((res) => console.log(res));;

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//changuito.addToCart(3,4).then((res) => console.log(res));

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//changuito.deleteFromCart(1,1).then((res) => console.log(res));

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
//changuito.deleteAllFromCart(3).then((res) => console.log(res));

// PREUBA DE MODULO QUE ELIMINA UN CARRITO COMO TAL
//changuito.deleteCart(4).then((res) => console.log(res));

module.exports = changuito;