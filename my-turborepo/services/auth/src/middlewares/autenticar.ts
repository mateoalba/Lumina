import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utilidades/jwt';
import { PayloadJWT } from '../tipos';

export interface RequestAutenticada extends Request {
  usuario?: PayloadJWT;
}

export const autenticar = (
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): void => {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    res.status(401).json({ exito: false, mensaje: 'Token no proporcionado' });
    return;
  }

  const token = encabezado.split(' ')[1];

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ exito: false, mensaje: 'Token inválido o expirado' });
  }
};