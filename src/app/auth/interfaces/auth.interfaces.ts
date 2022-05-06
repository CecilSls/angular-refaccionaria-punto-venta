
export interface Login{
    id: number;
    tokenType: string;
    accesToken: string;
    username: string;
    roles: number;
}

export interface AuthResponse{
    ok: boolean;
    message: string;
    token?: string;
    data?: {};
}

export interface Estatus{
    id_status: number;
    description: string;
}

export interface Role{
    id_tipo: number;
    description: string;
}

export interface Usuario{
    id_usuario: number;
    username: string;
    password: string;
    nombre: string;
    id_tipo: number;
    id_status: number;
    create_date: string;
}
