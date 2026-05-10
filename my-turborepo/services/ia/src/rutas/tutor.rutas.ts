import express, { Router } from 'express';
import { chat, retroalimentacion } from '../controladores/tutor.controlador';

const enrutador: express.Router = Router();

enrutador.post('/chat', chat);
enrutador.post('/retroalimentacion', retroalimentacion);

export default enrutador;