import Producto from './Producto.js'


class Carrito {
    constructor() {
        this.productos = this.obtenerCarrito() || [];
    }
    guardarCarrito() {
        localStorage.setItem('cart', JSON.stringify(this.productos));
    }

    obtenerCarrito() {
        const carritoGuardado = localStorage.getItem('cart');
        return carritoGuardado
            ? JSON.parse(carritoGuardado).map(item => new Producto(item.id, item.nombre, item.descripcion, item.precio, item.cantidad))
            : [];
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
        this.guardarCarrito();
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    }

    vaciarCarrito() {
        this.productos = [];
        this.guardarCarrito();
    }
    contarProductos() {
        return this.productos.reduce((total, producto) => total + producto.cantidad, 0);
    }
    eliminarProducto(id) {
        this.productos = this.productos.filter(item => item.id !== id)
        this.guardarCarrito();
    }
}

export default Carrito;