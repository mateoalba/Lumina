# LUMINA — Esquemas de MongoDB

## COLECCIÓN: mensajes_ia
Historial de conversaciones entre estudiante y tutor IA

{
  _id: ObjectId,
  sesionId: string,           // ref → sesiones_ia (PostgreSQL)
  usuarioId: string,          // ref → usuarios (PostgreSQL)
  rol: "usuario" | "asistente",
  contenido: string,
  tokensUsados: number,
  modelo: string,             // "claude-sonnet-4-5"
  fragmentosContexto: [
    {
      leccionId: string,
      fragmento: string,
      similitud: number       // 0.0 - 1.0
    }
  ],
  creadoEn: Date
}

Índices:
  { sesionId: 1, creadoEn: 1 }
  { usuarioId: 1, creadoEn: -1 }

---

## COLECCIÓN: registros_actividad
Log de cada acción del usuario para analytics

{
  _id: ObjectId,
  usuarioId: string,
  evento: string,
  metadatos: {
    cursoId?: string,
    leccionId?: string,
    cuestionarioId?: string,
    puntaje?: number,
    duracionSegundos?: number,
    dispositivo?: string      // "web" | "mobile"
  },
  ip: string,
  agenteUsuario: string,
  creadoEn: Date              // TTL: se elimina a los 90 días
}

Eventos posibles:
  "sesion_iniciada"         "leccion_iniciada"
  "leccion_completada"      "video_pausado"
  "cuestionario_iniciado"   "cuestionario_enviado"
  "chat_ia_abierto"         "mensaje_ia_enviado"
  "curso_matriculado"       "curso_completado"

Índices:
  { usuarioId: 1, creadoEn: -1 }
  { evento: 1, creadoEn: -1 }
  { creadoEn: 1 }  ← TTL index, expira en 90 días

---

## COLECCIÓN: analiticas_curso
Métricas agregadas por curso, se actualizan cada hora via BullMQ

{
  _id: ObjectId,
  cursoId: string,
  totalMatriculas: number,
  estudiantesActivos: number,
  tasaCompletacion: number,   // 0-100
  puntajePromedio: number,
  tiempoPromedioSegundos: number,
  estadisticasLecciones: [
    {
      leccionId: string,
      vistas: number,
      tiempoPromedioSegundos: number,
      tasaAbandonoVideo: number
    }
  ],
  actualizadoEn: Date
}

Índices:
  { cursoId: 1 }  único

---

## COLECCIÓN: cache_retroalimentacion_ia
Caché de feedback de IA para no llamar a la API cada vez
que alguien falla la misma pregunta

{
  _id: ObjectId,
  preguntaId: string,
  opcionId: string,
  retroalimentacion: string,
  modelo: string,
  tokensUsados: number,
  vecesUsado: number,
  creadoEn: Date,
  expiraEn: Date              // TTL: se elimina a los 30 días
}

Índices:
  { preguntaId: 1, opcionId: 1 }  único
  { expiraEn: 1 }  ← TTL index