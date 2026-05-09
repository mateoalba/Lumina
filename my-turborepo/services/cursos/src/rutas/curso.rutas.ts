import express, { Router } from 'express';
import { autenticar, soloInstructor } from '../middlewares/autenticar';
import {
  crearNuevoCurso, listarCursos, verCurso,
  agregarModulo, agregarLeccion, matricularse,
} from '../controladores/curso.controlador';

const enrutador: express.Router = Router();

// Rutas públicas
enrutador.get('/', listarCursos);
enrutador.get('/:slug', verCurso);

// Rutas de instructor
enrutador.post('/', autenticar, soloInstructor, crearNuevoCurso);
enrutador.post('/:cursoId/modulos', autenticar, soloInstructor, agregarModulo);
enrutador.post('/modulos/:moduloId/lecciones', autenticar, soloInstructor, agregarLeccion);

// Rutas de estudiante
enrutador.post('/:cursoId/matricularse', autenticar, matricularse);

export default enrutador;