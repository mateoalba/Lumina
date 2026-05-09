import jwt from 'jsonwebtoken';
import { PayloadJWT } from '../tipos';

const SECRETO = process.env.JWT_SECRETO || 'secreto_temporal';
const EXPIRA_EN = process.env.JWT_EXPIRA_EN || '15m';
const REFRESCO_EXPIRA_EN = process.env.JWT_REFRESCO_EXPIRA_EN || '7d';

export const generarToken = (payload: PayloadJWT): string => {
  return jwt.sign(payload, SECRETO, { expiresIn: EXPIRA_EN } as jwt.SignOptions);
};

export const generarTokenRefresco = (payload: PayloadJWT): string => {
  return jwt.sign(payload, SECRETO, { expiresIn: REFRESCO_EXPIRA_EN } as jwt.SignOptions);
};

export const verificarToken = (token: string): PayloadJWT => {
  return jwt.verify(token, SECRETO) as PayloadJWT;
};