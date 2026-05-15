"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Leccion {
  id: string;
  titulo: string;
  tipo: string;
  duracion: number | null;
  esGratuita: boolean;
  orden: number;
}

interface Modulo {
  id: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  lecciones: Leccion[];
}

interface Curso {
  id: string;
  titulo: string;
  descripcion: string | null;
  nivel: string | null;
  esGratuito: boolean;
  precio: number | null;
  slug: string;
  totalHoras: number | null;
  instructor: { id: string; nombreCompleto: string; correo: string };
  categoria: { nombre: string } | null;
  modulos: Modulo[];
  _count: { matriculas: number };
}

export default function DetalleCurso({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [matriculando, setMatriculando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [moduloAbierto, setModuloAbierto] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3002/api/cursos/${params.slug}`)
      .then((res) => setCurso(res.data.datos))
      .catch(() => router.push("/cursos"))
      .finally(() => setCargando(false));
  }, [params.slug, router]);

  const matricularse = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/iniciar-sesion");
      return;
    }
    setMatriculando(true);
    try {
      await axios.post(`https://cursos-production-abeb.up.railway.app/api/cursos/${curso!.id}/matricularse`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("¡Te matriculaste exitosamente!");
    } catch (err: any) {
      setMensaje(err.response?.data?.mensaje || "Error al matricularse");
    } finally {
      setMatriculando(false);
    }
  };

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      Cargando...
    </div>
  );

  if (!curso) return null;

  const totalLecciones = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-purple-400">✦ Lumina</a>
        <a href="/cursos" className="text-gray-400 hover:text-white text-sm transition">
          ← Volver a cursos
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            {curso.nivel && (
              <span className="text-xs px-2 py-1 rounded border border-purple-700 text-purple-400">
                {curso.nivel}
              </span>
            )}
            {curso.categoria && (
              <span className="text-xs text-gray-500">{curso.categoria.nombre}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
          <p className="text-gray-400 mb-6">{curso.descripcion || "Sin descripción"}</p>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <span>👨‍🏫 {curso.instructor.nombreCompleto}</span>
            <span>👥 {curso._count.matriculas} estudiantes</span>
            <span>📚 {curso.modulos.length} módulos</span>
            <span>🎬 {totalLecciones} lecciones</span>
          </div>

          {/* Módulos */}
          <h2 className="text-xl font-semibold mb-4">Contenido del curso</h2>
          {curso.modulos.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
              Este curso aún no tiene contenido
            </div>
          ) : (
            <div className="space-y-3">
              {curso.modulos.map((modulo) => (
                <div key={modulo.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setModuloAbierto(moduloAbierto === modulo.id ? null : modulo.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition"
                  >
                    <span className="font-medium">{modulo.titulo}</span>
                    <span className="text-gray-400 text-sm">
                      {modulo.lecciones.length} lecciones {moduloAbierto === modulo.id ? "▲" : "▼"}
                    </span>
                  </button>
                  {moduloAbierto === modulo.id && (
                    <div className="border-t border-gray-800">
                      {modulo.lecciones.map((leccion) => (
                        <div key={leccion.id} className="px-6 py-3 flex items-center justify-between border-b border-gray-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm">
                              {leccion.tipo === "VIDEO" ? "🎬" : leccion.tipo === "LECTURA" ? "📄" : "❓"}
                            </span>
                            <span className="text-sm text-gray-300">{leccion.titulo}</span>
                            {leccion.esGratuita && (
                              <span className="text-xs text-green-400 border border-green-700 px-1 rounded">
                                Gratis
                              </span>
                            )}
                          </div>
                          {leccion.duracion && (
                            <span className="text-xs text-gray-500">{Math.floor(leccion.duracion / 60)} min</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
            <div className="text-3xl font-bold mb-2 text-center">
              {curso.esGratuito ? (
                <span className="text-green-400">Gratis</span>
              ) : (
                <span>${curso.precio}</span>
              )}
            </div>

            {mensaje && (
              <div className={`text-sm px-4 py-3 rounded-lg mb-4 text-center ${
                mensaje.includes("exitosamente")
                  ? "bg-green-900/30 border border-green-700 text-green-400"
                  : "bg-red-900/30 border border-red-700 text-red-400"
              }`}>
                {mensaje}
              </div>
            )}

            <button
              onClick={matricularse}
              disabled={matriculando || mensaje.includes("exitosamente")}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-medium transition mb-4"
            >
              {matriculando ? "Procesando..." : mensaje.includes("exitosamente") ? "¡Matriculado! ✓" : "Matricularse ahora"}
            </button>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>✅</span> Acceso de por vida
              </div>
              <div className="flex items-center gap-2">
                <span>🤖</span> Tutor IA incluido
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span> Acceso desde móvil
              </div>
              <div className="flex items-center gap-2">
                <span>🏆</span> Certificado al completar
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}