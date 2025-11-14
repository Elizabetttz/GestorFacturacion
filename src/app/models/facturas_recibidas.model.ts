export interface Facturas_recibidas{
    id: number;
    ruta: string;
    numero_factura: string;
    descripcion: string;
    comercializadora_nombre: string;
    comercializadora_nit: string;
    fecha_emision: Date;
    fecha_vencimiento: Date;
    subtotal: number;
    iva: number;
    descuento: number;
    rete_fuente: number;
    rete_iva: number;
    rete_ica: number;
    total: number;
}