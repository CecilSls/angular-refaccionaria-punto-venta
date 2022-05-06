

export interface VentaProductos{
    id_producto: number;
    codigo_barras: string;
    description: string;
    existencia: number;
    cantidad: number;
    precio: number;
    total: number;
}

export interface Producto{
    anaquel: number;
    codigo_barras: string;
    comprado: number;
    description: string;
    existencia: number;
    id_marca: number;
    id_producto: number;
    id_proveedor: number;
    modulo: number;
    precio_compra: number;
    precio_venta: number;
    stock_minimo: number;
    stock_maximo: number;
}

export interface Venta{
    id_venta: number;
	id_usuario: number;
	venta_fecha: string;
	venta_total: number;
	total_pagado: number;
	venta_descuento: number;
	recibido: number;
	cambio: number;
	ticket: string;
	pendiente: number;
	credito: number;
    nombre?:string;
}

export interface SaveProducts{
    id_usuario: number;
    venta_total: number;
    productos: VentaProductos[];
}

export interface ResponseSaveVenta{
    ticket: string;
}

export interface VentaRequest{
    id_usuario: number;
    venta_total: number;
    venta_descuento: number;
    total_pagado: number;
    recibido: number;
    cambio: number;
    pendiente: number;
}
// ===========> NEW
export interface Cobro{
    id_venta: number;
    total_pagado: number;
    venta_descuento: number;
    recibido: number;
    cambio: number;
    credito?: number;
    id_cliente?: number;
}

export interface CobroVenta{
    id_venta: number;
    pendiente: number;
    productos: Producto[];
    ticket: string;
    venta_fecha: string;
    venta_total: number;
}

export interface CreditoResponse{
    id_credito: number;
    id_venta: number;
    id_cliente: number;
    saldo: number;
    create_date: string;
    update_date: string;
    cliente: string;
    venta_total: number;
    total_pagado: number;
    ticket: string;
}

export interface CreditoRequest{
    id_venta: number;
    id_usuario: number;
    id_credito: number;
    fecha_abono: string;
    saldo: number;
    abono: number;
}

export interface Abono{
    fecha_pago: string;
    abono: number;
    saldo_anterior: number;
    saldo_actual: number;
}