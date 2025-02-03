class Carrito {
    constructor() {
        this.productos = [];
    }

    añadirProducto(producto) {
        const productoExistente = this.productos.find(
            (p) => p.id === producto.id
        );
        if (productoExistente) {
            productoExistente.incrementarCantidad();
        } else {
            this.productos.push(producto);
        }
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    }

    vaciarCarrito() {
        this.productos = [];
    }
    contarProductos() {
        return this.productos.reduce((total, producto) => total + producto.cantidad, 0);
    }
    eliminarProducto(id) {
        this.productos = this.productos.filter(item => item.id !== id)
    }
}

export default Carrito;