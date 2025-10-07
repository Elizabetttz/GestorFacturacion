export interface Factura{
    id: number;
    numero_factura: string;
    nit: string;
    tercero: string;
    fecha: Date;
    concepto: string;
    subtotal: number;
    iva: number;
    total: number;
    rete_fte: number;
    ica_6_9: number;
    rete_iva: number;
    factu_importes: number;
    total_descuentos: number;
    total_pagar:number;
    fecha_pago: Date;
    forma_pago: string;
    valor: number;
    saldo: number;
    revision: string;
}