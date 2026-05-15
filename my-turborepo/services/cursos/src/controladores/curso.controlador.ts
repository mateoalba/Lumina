import { Response } from 'express';
import { z } from 'zod';
import { RequestAutenticada } from '../middlewares/autenticar';
import {
  crearCurso, obtenerCursos, obtenerCursoPorSlug,
  crearModulo, crearLeccion, matricularEstudiante, publicarCurso,
} from '../servicios/curso.servicio';

const esquemaCurso = z.object({
  titulo: z.string().min(3, 'Título muy corto'),
  descripcion: z.string().optional(),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
  categoriaId: z.string().uuid().optional(),
  esGratuito: z.boolean().optional(),
  precio: z.number().positive().optional(),
});

const esquemaModulo = z.object({
  titulo: z.string().min(2, 'Título muy corto'),
  descripcion: z.string().optional(),
});

const esquemaLeccion = z.object({
  titulo: z.string().min(2, 'Título muy corto'),
  tipo: z.enum(['VIDEO', 'LECTURA', 'CUESTIONARIO']),
  contenido: z.string().optional(),
  urlVideo: z.string().url().optional(),
  duracion: z.number().positive().optional(),
  esGratuita: z.boolean().optional(),
});

export const crearNuevoCurso = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const datos = esquemaCurso.parse(req.body);
    const curso = await crearCurso(req.usuario!.usuarioId, datos);
    res.status(201).json({ exito: true, mensaje: 'Curso creado', datos: curso });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear curso';
    res.status(400).json({ exito: false, mensaje });
  }
};

export const listarCursos = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const { estado, nivel, categoriaId } = req.query as Record<string, string>;
    const cursos = await obtenerCursos({ estado, nivel, categoriaId });
    res.status(200).json({ exito: true, mensaje: 'Cursos obtenidos', datos: cursos });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener cursos';
    res.status(500).json({ exito: false, mensaje });
  }
};

export const verCurso = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const curso = await obtenerCursoPorSlug(slug);
    res.status(200).json({ exito: true, mensaje: 'Curso obtenido', datos: curso });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener curso';
    res.status(404).json({ exito: false, mensaje });
  }
};

export const agregarModulo = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const datos = esquemaModulo.parse(req.body);
    const { cursoId } = req.params as { cursoId: string };
    const modulo = await crearModulo(cursoId, req.usuario!.usuarioId, datos);
    res.status(201).json({ exito: true, mensaje: 'Módulo creado', datos: modulo });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear módulo';
    res.status(400).json({ exito: false, mensaje });
  }
};

export const agregarLeccion = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const datos = esquemaLeccion.parse(req.body);
    const { moduloId } = req.params as { moduloId: string };
    const leccion = await crearLeccion(moduloId, req.usuario!.usuarioId, datos);
    res.status(201).json({ exito: true, mensaje: 'Lección creada', datos: leccion });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear lección';
    res.status(400).json({ exito: false, mensaje });
  }
};

export const matricularse = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const { cursoId } = req.params as { cursoId: string };
    const matricula = await matricularEstudiante(req.usuario!.usuarioId, cursoId);
    res.status(201).json({ exito: true, mensaje: 'Matriculado exitosamente', datos: matricula });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al matricularse';
    res.status(400).json({ exito: false, mensaje });
  }

};

  
export const publicar = async (req: RequestAutenticada, res: Response): Promise<void> => {
  try {
    const { cursoId } = req.params as { cursoId: string };
    const curso = await publicarCurso(cursoId, req.usuario!.usuarioId);
    res.status(200).json({ exito: true, mensaje: 'Curso publicado', datos: curso });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al publicar';
    res.status(400).json({ exito: false, mensaje });
  }
};