class Producto {
    constructor(id, nombre, descripcion, precio, cantidad = 1) {
        this.id = id;

        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio
        this.cantidad = cantidad;
    }

    incrementarCantidad() {
        this.cantidad += 1;
    }
}

export default Producto;