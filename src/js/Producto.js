class Producto {
    constructor(id, nombre, descripcion, precio) {
        this.id = id;

        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseFloat(precio.replace(/[^\d.-]/g, '')); // Convierte el precio a número
        this.cantidad = 1;
    }

    incrementarCantidad() {
        this.cantidad += 1;
    }
}

export default Producto;