import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import tutorRutas from './rutas/tutor.rutas';

const app: express.Application = express();
const PUERTO = process.env.PORT || process.env.PUERTO || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/ia', tutorRutas);

app.get('/salud', (_req, res) => {
  res.json({ exito: true, mensaje: 'Servicio de IA funcionando' });
});

app.listen(PUERTO, () => {
  console.log(`🚀 Servicio IA corriendo en http://localhost:${PUERTO}`);
});

export default app;