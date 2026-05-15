import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearCurso = async (
  instructorId: string,
  datos: {
    titulo: string;
    descripcion?: string;
    nivel?: string;
    categoriaId?: string;
    esGratuito?: boolean;
    precio?: number;
  }
) => {
  const slug = datos.titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  const curso = await prisma.curso.create({
    data: {
      instructorId,
      titulo: datos.titulo,
      slug: `${slug}-${Date.now()}`,
      descripcion: datos.descripcion,
      nivel: datos.nivel,
      categoriaId: datos.categoriaId,
      esGratuito: datos.esGratuito ?? true,
      precio: datos.precio ? datos.precio : null,
    },
    include: {
      instructor: {
        select: { id: true, nombreCompleto: true, correo: true },
      },
      categoria: true,
    },
  });

  return curso;
};

export const obtenerCursos = async (filtros?: {
  estado?: string;
  nivel?: string;
  categoriaId?: string;
}) => {
  const cursos = await prisma.curso.findMany({
    where: {
      estado: (filtros?.estado as any) ?? 'PUBLICADO',
      nivel: filtros?.nivel,
      categoriaId: filtros?.categoriaId,
    },
    include: {
      instructor: {
        select: { id: true, nombreCompleto: true },
      },
      categoria: true,
      _count: {
        select: { matriculas: true, modulos: true },
      },
    },
    orderBy: { creadoEn: 'desc' },
  });

  return cursos;
};

export const obtenerCursoPorSlug = async (slug: string) => {
  const curso = await prisma.curso.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: { id: true, nombreCompleto: true, correo: true },
      },
      categoria: true,
      modulos: {
        orderBy: { orden: 'asc' },
        include: {
          lecciones: {
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              titulo: true,
              tipo: true,
              duracion: true,
              esGratuita: true,
              orden: true,
            },
          },
        },
      },
      _count: {
        select: { matriculas: true },
      },
    },
  });

  if (!curso) throw new Error('Curso no encontrado');
  return curso;
};

export const crearModulo = async (
  cursoId: string,
  instructorId: string,
  datos: { titulo: string; descripcion?: string }
) => {
  const curso = await prisma.curso.findUnique({ where: { id: cursoId } });
  if (!curso) throw new Error('Curso no encontrado');
  if (curso.instructorId !== instructorId) throw new Error('No tienes permiso');

  const ultimoModulo = await prisma.modulo.findFirst({
    where: { cursoId },
    orderBy: { orden: 'desc' },
  });

  const orden = (ultimoModulo?.orden ?? 0) + 1;

  return prisma.modulo.create({
    data: { cursoId, titulo: datos.titulo, descripcion: datos.descripcion, orden },
  });
};

export const crearLeccion = async (
  moduloId: string,
  instructorId: string,
  datos: {
    titulo: string;
    tipo: 'VIDEO' | 'LECTURA' | 'CUESTIONARIO';
    contenido?: string;
    urlVideo?: string;
    duracion?: number;
    esGratuita?: boolean;
  }
) => {
  const modulo = await prisma.modulo.findUnique({
    where: { id: moduloId },
    include: { curso: true },
  });

  if (!modulo) throw new Error('Módulo no encontrado');
  if (modulo.curso.instructorId !== instructorId) throw new Error('No tienes permiso');

  const ultimaLeccion = await prisma.leccion.findFirst({
    where: { moduloId },
    orderBy: { orden: 'desc' },
  });

  const orden = (ultimaLeccion?.orden ?? 0) + 1;

  return prisma.leccion.create({
    data: {
      moduloId,
      titulo: datos.titulo,
      tipo: datos.tipo,
      contenido: datos.contenido,
      urlVideo: datos.urlVideo,
      duracion: datos.duracion,
      esGratuita: datos.esGratuita ?? false,
      orden,
    },
  });
};

export const matricularEstudiante = async (usuarioId: string, cursoId: string) => {
  const existente = await prisma.matricula.findUnique({
    where: { usuarioId_cursoId: { usuarioId, cursoId } },
  });

  if (existente) throw new Error('Ya estás matriculado en este curso');

  return prisma.matricula.create({
    data: { usuarioId, cursoId },
    include: { curso: { select: { titulo: true, slug: true } } },
  });
};


export const publicarCurso = async (cursoId: string, instructorId: string) => {
  const curso = await prisma.curso.findUnique({ where: { id: cursoId } });
  if (!curso) throw new Error('Curso no encontrado');
  if (curso.instructorId !== instructorId) throw new Error('No tienes permiso');

  return prisma.curso.update({
    where: { id: cursoId },
    data: { estado: 'PUBLICADO' },
  });
};