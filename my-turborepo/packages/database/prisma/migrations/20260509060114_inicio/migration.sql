-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ESTUDIANTE', 'INSTRUCTOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoCurso" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "TipoLeccion" AS ENUM ('VIDEO', 'LECTURA', 'CUESTIONARIO');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('ACTIVA', 'COMPLETADA', 'ABANDONADA');

-- CreateEnum
CREATE TYPE "EstadoIntento" AS ENUM ('EN_PROGRESO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('ACTUALIZACION_CURSO', 'RESULTADO_CUESTIONARIO', 'RETROALIMENTACION_IA', 'SISTEMA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "correo" TEXT NOT NULL,
    "contrasenaHash" TEXT,
    "nombreCompleto" TEXT NOT NULL,
    "urlAvatar" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'ESTUDIANTE',
    "estaVerificado" BOOLEAN NOT NULL DEFAULT false,
    "proveedorOauth" TEXT,
    "idOauth" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_usuario" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "biografia" TEXT,
    "titular" TEXT,
    "sitioWeb" TEXT,
    "pais" TEXT,
    "zonaHoraria" TEXT DEFAULT 'UTC',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_refresco" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_refresco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "urlIcono" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "instructorId" UUID NOT NULL,
    "categoriaId" UUID,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "urlPortada" TEXT,
    "estado" "EstadoCurso" NOT NULL DEFAULT 'BORRADOR',
    "nivel" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "precio" DECIMAL(10,2),
    "esGratuito" BOOLEAN NOT NULL DEFAULT true,
    "totalHoras" DOUBLE PRECISION,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas_curso" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cursoId" UUID NOT NULL,
    "etiqueta" TEXT NOT NULL,

    CONSTRAINT "etiquetas_curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cursoId" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "moduloId" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoLeccion" NOT NULL,
    "orden" INTEGER NOT NULL,
    "contenido" TEXT,
    "urlVideo" TEXT,
    "duracion" INTEGER,
    "esGratuita" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuestionarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "leccionId" UUID NOT NULL,
    "puntajeMinimo" INTEGER NOT NULL DEFAULT 70,
    "limiteTiempo" INTEGER,
    "maxIntentos" INTEGER NOT NULL DEFAULT 3,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuestionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cuestionarioId" UUID NOT NULL,
    "texto" TEXT NOT NULL,
    "explicacion" TEXT,
    "orden" INTEGER NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "preguntaId" UUID NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "opciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "cursoId" UUID NOT NULL,
    "estado" "EstadoMatricula" NOT NULL DEFAULT 'ACTIVA',
    "progreso" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matriculadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completadoEn" TIMESTAMP(3),

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_lecciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "matriculaId" UUID NOT NULL,
    "leccionId" UUID NOT NULL,
    "estaCompleta" BOOLEAN NOT NULL DEFAULT false,
    "segundosVisto" INTEGER NOT NULL DEFAULT 0,
    "completadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progreso_lecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intentos_cuestionario" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "cuestionarioId" UUID NOT NULL,
    "puntaje" DOUBLE PRECISION,
    "aprobado" BOOLEAN,
    "estado" "EstadoIntento" NOT NULL DEFAULT 'EN_PROGRESO',
    "iniciadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completadoEn" TIMESTAMP(3),

    CONSTRAINT "intentos_cuestionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "intentoId" UUID NOT NULL,
    "preguntaId" UUID NOT NULL,
    "opcionId" UUID NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL,
    "retroalimentacionIA" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respuestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incrustaciones_lecciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "leccionId" UUID NOT NULL,
    "fragmento" TEXT NOT NULL,
    "incrustacion" vector,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incrustaciones_lecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_ia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "cursoId" UUID,
    "titulo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "metadatos" JSONB,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_usuario_usuarioId_key" ON "perfiles_usuario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refresco_token_key" ON "tokens_refresco"("token");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_slug_key" ON "cursos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_curso_cursoId_etiqueta_key" ON "etiquetas_curso"("cursoId", "etiqueta");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_cursoId_orden_key" ON "modulos"("cursoId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "lecciones_moduloId_orden_key" ON "lecciones"("moduloId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "cuestionarios_leccionId_key" ON "cuestionarios"("leccionId");

-- CreateIndex
CREATE UNIQUE INDEX "preguntas_cuestionarioId_orden_key" ON "preguntas"("cuestionarioId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_usuarioId_cursoId_key" ON "matriculas"("usuarioId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_lecciones_matriculaId_leccionId_key" ON "progreso_lecciones"("matriculaId", "leccionId");

-- AddForeignKey
ALTER TABLE "perfiles_usuario" ADD CONSTRAINT "perfiles_usuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_refresco" ADD CONSTRAINT "tokens_refresco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas_curso" ADD CONSTRAINT "etiquetas_curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulos" ADD CONSTRAINT "modulos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecciones" ADD CONSTRAINT "lecciones_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "cuestionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones" ADD CONSTRAINT "opciones_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_lecciones" ADD CONSTRAINT "progreso_lecciones_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "matriculas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_lecciones" ADD CONSTRAINT "progreso_lecciones_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "lecciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_cuestionario" ADD CONSTRAINT "intentos_cuestionario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_cuestionario" ADD CONSTRAINT "intentos_cuestionario_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "cuestionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_intentoId_fkey" FOREIGN KEY ("intentoId") REFERENCES "intentos_cuestionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "preguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_opcionId_fkey" FOREIGN KEY ("opcionId") REFERENCES "opciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incrustaciones_lecciones" ADD CONSTRAINT "incrustaciones_lecciones_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_ia" ADD CONSTRAINT "sesiones_ia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
