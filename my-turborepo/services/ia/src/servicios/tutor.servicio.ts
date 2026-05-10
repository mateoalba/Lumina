import Anthropic from '@anthropic-ai/sdk';

const cliente = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export interface MensajeChat {
  rol: 'usuario' | 'asistente';
  contenido: string;
}

export const chatConTutor = async (
  mensajes: MensajeChat[],
  contextoCurso?: string
): Promise<string> => {
  const systemPrompt = `Eres Lumina, un tutor de IA amigable y experto que ayuda a estudiantes a aprender. 
Tu objetivo es explicar conceptos de forma clara, dar ejemplos prácticos y motivar al estudiante.
Responde siempre en español de forma concisa y amigable.
${contextoCurso ? `\nContexto del curso actual:\n${contextoCurso}` : ''}`;

  const mensajesFormateados = mensajes.map((m) => ({
    role: m.rol === 'usuario' ? 'user' as const : 'assistant' as const,
    content: m.contenido,
  }));

  const respuesta = await cliente.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: mensajesFormateados,
  });

  const bloque = respuesta.content[0];
  if (bloque.type === 'text') return bloque.text;
  return 'No pude generar una respuesta.';
};

export const generarRetroalimentacion = async (
  pregunta: string,
  respuestaCorrecta: string,
  respuestaEstudiante: string
): Promise<string> => {
  const respuesta = await cliente.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Soy un estudiante que respondió incorrectamente una pregunta. 
Dame una retroalimentación corta, amigable y educativa en español.

Pregunta: ${pregunta}
Respuesta correcta: ${respuestaCorrecta}
Mi respuesta: ${respuestaEstudiante}

Dame una explicación breve de por qué mi respuesta no es correcta y cómo recordar la respuesta correcta.`,
      },
    ],
  });

  const bloque = respuesta.content[0];
  if (bloque.type === 'text') return bloque.text;
  return 'No pude generar retroalimentación.';
};