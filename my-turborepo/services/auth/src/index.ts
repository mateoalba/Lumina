import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRutas from './rutas/auth.rutas';



const app: express.Application = express();
const PUERTO = process.env.PUERTO || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRutas);

// Ruta de salud
app.get('/salud', (_req, res) => {
  res.json({ exito: true, mensaje: 'Servicio de autenticación funcionando' });
});

app.listen(PUERTO, () => {
  console.log(`🚀 Servicio auth corriendo en http://localhost:${PUERTO}`);
});

export default app;