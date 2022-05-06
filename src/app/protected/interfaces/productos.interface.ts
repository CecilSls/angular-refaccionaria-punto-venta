export interface ProductoResponse {
    id_producto: number;
    id_proveedor: number;
    id_marca: number;
    codigo_barras: string;
    description: string;
    existencia: number;
    comprado: number;
    precio_venta: number;
    precio_compra: number;
    modulo: number;
    anaquel: number;
    stock_minimo: number;
    stock_maximo: number;
}

export interface Marca{
    id_marca: number;
    description: string;
    id_status: number;
}

export interface Proveedor{
    id_proveedor: number;
    nombre: string;
    empresa: string;
    telefono_contacto: string;
    email_contacto: string;
}