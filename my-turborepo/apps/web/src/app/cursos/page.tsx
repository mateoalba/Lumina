"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  nivel: string;
  esGratuito: boolean;
  precio: number | null;
  slug: string;
  instructor: { nombreCompleto: string };
  _count: { matriculas: number; modulos: number };
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/cursos")
      .then((res) => setCursos(res.data.datos))
      .catch(() => setCursos([]))
      .finally(() => setCargando(false));
  }, []);

  const nivelColor: Record<string, string> = {
    principiante: "text-green-400 bg-green-900/30 border-green-700",
    intermedio: "text-yellow-400 bg-yellow-900/30 border-yellow-700",
    avanzado: "text-red-400 bg-red-900/30 border-red-700",
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-purple-400">✦ Lumina</a>
        <div className="flex gap-4">
          <a href="/tablero" className="text-gray-300 hover:text-white text-sm transition">
            Mi tablero
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explorar cursos</h1>
          <p className="text-gray-400">Aprende con los mejores instructores y un tutor IA.</p>
        </div>

        {cargando ? (
          <div className="text-center py-20 text-gray-400">Cargando cursos...</div>
        ) : cursos.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-gray-400 mb-2">No hay cursos publicados aún</p>
            <p className="text-gray-500 text-sm">Vuelve pronto para ver nuevos cursos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-700 transition group"
              >
                <div className="bg-linear-to-br from-purple-900/40 to-gray-800 h-40 flex items-center justify-center">
                  <span className="text-5xl">📘</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {curso.nivel && (
                      <span className={`text-xs px-2 py-1 rounded border ${nivelColor[curso.nivel] || "text-gray-400"}`}>
                        {curso.nivel}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {curso._count.modulos} módulos
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-400 transition">
                    {curso.titulo}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {curso.descripcion || "Sin descripción"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {curso.instructor?.nombreCompleto}
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {curso.esGratuito ? "Gratis" : `$${curso.precio}`}
                    </span>
                  </div>
                  <a
                    href={`/cursos/${curso.slug}`}
                    className="mt-4 block w-full text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Ver curso
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}