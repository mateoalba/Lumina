"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  nombreCompleto: string;
  correo: string;
  rol: string;
}

export default function Tablero() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (!datos) {
      router.push("/auth/iniciar-sesion");
      return;
    }
    setUsuario(JSON.parse(datos));
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/");
  };

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-purple-400">✦ Lumina</a>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hola, {usuario.nombreCompleto}</span>
          <button onClick={cerrarSesion} className="text-gray-400 hover:text-white text-sm transition">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1">
            Bienvenido, {usuario.nombreCompleto.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400">Continúa tu aprendizaje donde lo dejaste.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Cursos matriculados</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Lecciones completadas</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Progreso general</p>
            <p className="text-3xl font-bold text-purple-400">0%</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Mis cursos</h2>
            <a href="/cursos" className="text-purple-400 hover:text-purple-300 text-sm transition">
              Ver todos los cursos →
            </a>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-400 mb-4">No estás matriculado en ningún curso aún</p>
            <a href="/cursos" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition">
              Explorar cursos
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-purple-800 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">🤖 Tutor IA disponible</h3>
            <p className="text-gray-400 text-sm">Pregunta cualquier duda sobre tus cursos.</p>
          </div>
          <a href="/chat" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition">
            Abrir chat
          </a>
        </div>
      </div>
    </main>
  );
}