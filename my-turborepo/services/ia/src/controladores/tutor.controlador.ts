import { Request, Response } from 'express';
import { z } from 'zod';
import { chatConTutor, generarRetroalimentacion } from '../servicios/tutor.servicio';

const esquemaChat = z.object({
  mensajes: z.array(z.object({
    rol: z.enum(['usuario', 'asistente']),
    contenido: z.string(),
  })),
  contextoCurso: z.string().optional(),
});

const esquemaRetroalimentacion = z.object({
  pregunta: z.string(),
  respuestaCorrecta: z.string(),
  respuestaEstudiante: z.string(),
});

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const datos = esquemaChat.parse(req.body);
    const respuesta = await chatConTutor(datos.mensajes, datos.contextoCurso);
    res.status(200).json({ exito: true, datos: { respuesta } });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error en el chat';
    res.status(500).json({ exito: false, mensaje });
  }
};

export const retroalimentacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const datos = esquemaRetroalimentacion.parse(req.body);
    const feedback = await generarRetroalimentacion(
      datos.pregunta,
      datos.respuestaCorrecta,
      datos.respuestaEstudiante
    );
    res.status(200).json({ exito: true, datos: { feedback } });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar retroalimentación';
    res.status(500).json({ exito: false, mensaje });
  }
};