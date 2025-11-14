export interface Ordenes_Compra{
    id: number;
    comprador_nit: string;
    comprador_nombre: string;
    fecha_elaboracion: Date;
    descripcion: string;
    cantidad: string;
    precio_unitario: number;
    valor_total_item: number;
    subtotal: number;
    iva: number;
    total: number;
    terminos_pago: string;
    ruta: string;
}