export interface RespuestaAPI<T = unknown> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  error?: string;
}

export interface PayloadJWT {
  usuarioId: string;
  correo: string;
  rol: 'ESTUDIANTE' | 'INSTRUCTOR' | 'ADMINISTRADOR';
}