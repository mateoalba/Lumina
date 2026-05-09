import { Request, Response } from 'express';
import { z } from 'zod';
import { registrarUsuario, iniciarSesion, cerrarSesion } from '../servicios/auth.servicio';

const esquemaRegistro = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
  nombreCompleto: z.string().min(2, 'Nombre muy corto'),
});

const esquemaLogin = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
});

export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const datos = esquemaRegistro.parse(req.body);
    const resultado = await registrarUsuario(
      datos.correo,
      datos.contrasena,
      datos.nombreCompleto
    );
    res.status(201).json({ exito: true, mensaje: 'Usuario registrado', datos: resultado });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ exito: false, mensaje: 'Datos inválidos', error: error.issues });
      return;
    }
    const mensaje = error instanceof Error ? error.message : 'Error al registrar';
    res.status(400).json({ exito: false, mensaje });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const datos = esquemaLogin.parse(req.body);
    const resultado = await iniciarSesion(datos.correo, datos.contrasena);
    res.status(200).json({ exito: true, mensaje: 'Sesión iniciada', datos: resultado });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ exito: false, mensaje: 'Datos inválidos', error: error.issues });
      return;
    }
    const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
    res.status(401).json({ exito: false, mensaje });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenRefresco } = req.body;
    if (!tokenRefresco) {
      res.status(400).json({ exito: false, mensaje: 'Token de refresco requerido' });
      return;
    }
    await cerrarSesion(tokenRefresco);
    res.status(200).json({ exito: true, mensaje: 'Sesión cerrada' });
  } catch {
    res.status(500).json({ exito: false, mensaje: 'Error al cerrar sesión' });
  }
};