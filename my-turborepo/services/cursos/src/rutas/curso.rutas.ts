import express, { Router } from 'express';
import { autenticar, soloInstructor } from '../middlewares/autenticar';
import {
  crearNuevoCurso, listarCursos, verCurso,
  agregarModulo, agregarLeccion, matricularse,
  publicar,
} from '../controladores/curso.controlador';

const enrutador: express.Router = Router();

// Rutas públicas
enrutador.get('/', listarCursos);


// Rutas de instructor
enrutador.post('/', autenticar, soloInstructor, crearNuevoCurso);
enrutador.post('/:cursoId/modulos', autenticar, soloInstructor, agregarModulo);
enrutador.patch('/:cursoId/publicar', autenticar, soloInstructor, publicar);
enrutador.post('/modulos/:moduloId/lecciones', autenticar, soloInstructor, agregarLeccion);


// Rutas de estudiante
enrutador.post('/:cursoId/matricularse', autenticar, matricularse);
// Ruta pública con parámetro (SIEMPRE AL FINAL)
enrutador.get('/:slug', verCurso);

export default enrutador;