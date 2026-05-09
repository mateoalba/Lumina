import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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
    const payload = jwt.verify(token, process.env.JWT_SECRETO || '') as PayloadJWT;
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ exito: false, mensaje: 'Token inválido o expirado' });
  }
};

export const soloInstructor = (
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): void => {
  if (req.usuario?.rol !== 'INSTRUCTOR' && req.usuario?.rol !== 'ADMINISTRADOR') {
    res.status(403).json({ exito: false, mensaje: 'Acceso denegado' });
    return;
  }
  next();
};