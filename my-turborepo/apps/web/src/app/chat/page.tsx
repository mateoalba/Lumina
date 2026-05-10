"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Mensaje {
  rol: "usuario" | "asistente";
  contenido: string;
}

export default function Chat() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: "asistente",
      contenido: "¡Hola! 👋 Soy Lumina, tu tutor IA. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) router.push("/auth/iniciar-sesion");
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return;

    const nuevoMensaje: Mensaje = { rol: "usuario", contenido: input };
    const nuevaLista = [...mensajes, nuevoMensaje];
    setMensajes(nuevaLista);
    setInput("");
    setCargando(true);

    try {
      const res = await axios.post("http://localhost:3003/api/ia/chat", {
        mensajes: nuevaLista,
      });
      setMensajes([
        ...nuevaLista,
        { rol: "asistente", contenido: res.data.datos.respuesta },
      ]);
    } catch {
      setMensajes([
        ...nuevaLista,
        { rol: "asistente", contenido: "Lo siento, hubo un error. Intenta de nuevo." },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const manejarTecla = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navegación */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <a href="/" className="text-xl font-bold text-purple-400">✦ Lumina</a>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Tutor IA activo</span>
          <a href="/tablero" className="text-gray-400 hover:text-white text-sm transition ml-4">
            Mi tablero
          </a>
        </div>
      </nav>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {mensajes.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.rol === "usuario" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                msg.rol === "asistente"
                  ? "bg-purple-600"
                  : "bg-gray-700"
              }`}>
                {msg.rol === "asistente" ? "✦" : "👤"}
              </div>
              <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.rol === "asistente"
                  ? "bg-gray-900 border border-gray-800 text-gray-100"
                  : "bg-purple-600 text-white"
              }`}>
                {msg.contenido}
              </div>
            </div>
          ))}

          {cargando && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                ✦
              </div>
              <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarTecla}
            placeholder="Pregunta cualquier cosa sobre tu curso... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-xl transition flex-shrink-0"
          >
            ➤
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-2">
          Presiona Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </main>
  );
}