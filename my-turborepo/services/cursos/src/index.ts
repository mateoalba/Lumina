import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cursoRutas from './rutas/curso.rutas';

const app: express.Application = express();
const PUERTO = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/cursos', cursoRutas);

app.get('/salud', (_req, res) => {
  res.json({ exito: true, mensaje: 'Servicio de cursos funcionando' });
});

app.listen(PUERTO, () => {
  console.log(`🚀 Servicio cursos corriendo en http://localhost:${PUERTO}`);
});

export default app;