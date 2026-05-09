import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generarToken, generarTokenRefresco } from '../utilidades/jwt';

const prisma = new PrismaClient();

export const registrarUsuario = async (
  correo: string,
  contrasena: string,
  nombreCompleto: string
) => {
  const existente = await prisma.usuario.findUnique({ where: { correo } });
  if (existente) throw new Error('El correo ya está registrado');

  const hash = await bcrypt.hash(contrasena, 12);

  const usuario = await prisma.usuario.create({
    data: { correo, contrasenaHash: hash, nombreCompleto },
    select: { id: true, correo: true, nombreCompleto: true, rol: true },
  });

  const payload = { usuarioId: usuario.id, correo: usuario.correo, rol: usuario.rol };
  const token = generarToken(payload);
  const tokenRefresco = generarTokenRefresco(payload);

  await prisma.tokenRefresco.create({
    data: {
      usuarioId: usuario.id,
      token: tokenRefresco,
      expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { usuario, token, tokenRefresco };
};

export const iniciarSesion = async (correo: string, contrasena: string) => {
  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario || !usuario.contrasenaHash) {
    throw new Error('Credenciales inválidas');
  }

  const esValida = await bcrypt.compare(contrasena, usuario.contrasenaHash);
  if (!esValida) throw new Error('Credenciales inválidas');

  const payload = { usuarioId: usuario.id, correo: usuario.correo, rol: usuario.rol };
  const token = generarToken(payload);
  const tokenRefresco = generarTokenRefresco(payload);

  await prisma.tokenRefresco.create({
    data: {
      usuarioId: usuario.id,
      token: tokenRefresco,
      expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    usuario: { id: usuario.id, correo: usuario.correo, nombreCompleto: usuario.nombreCompleto, rol: usuario.rol },
    token,
    tokenRefresco,
  };
};

export const cerrarSesion = async (tokenRefresco: string) => {
  await prisma.tokenRefresco.deleteMany({ where: { token: tokenRefresco } });
};