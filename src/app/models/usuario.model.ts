export interface Usuario{
    id: number;
    nombre: string;
    documento: string;
    tipo_usuario: string;
    password: string;
    created_at?: Date;
    avatar?: string;
}