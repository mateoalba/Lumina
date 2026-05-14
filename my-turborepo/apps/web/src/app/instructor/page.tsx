"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Curso {
  id: string;
  titulo: string;
  estado: string;
  slug: string;
  _count: { matriculas: number; modulos: number };
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!datos || !token) { router.push("/auth/iniciar-sesion"); return; }
    const u = JSON.parse(datos);
    if (u.rol !== "INSTRUCTOR" && u.rol !== "ADMINISTRADOR") {
      router.push("/tablero"); return;
    }
    setUsuario(u);
    axios.get("http://localhost:3002/api/cursos?estado=BORRADOR", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setCursos(r.data.datos || []))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [router]);

  const cerrarSesion = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <a href="/" className="text-lg font-bold text-purple-400">✦ Lumina</a>
          <p className="text-xs text-gray-500 mt-1">Portal Instructor</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <a href="/instructor" className="flex items-center gap-3 px-3 py-2.5 bg-purple-900/40 text-purple-300 rounded-lg text-sm font-medium">
            📊 Dashboard
          </a>
          <a href="/instructor/cursos/nuevo" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition">
            ➕ Nuevo curso
          </a>
          <a href="/cursos" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition">
            🎓 Ver plataforma
          </a>
          <a href="/chat" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition">
            🤖 Tutor IA
          </a>
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-1">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">{usuario.nombreCompleto}</div>
          <button onClick={cerrarSesion} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Bienvenido, {usuario.nombreCompleto.split(" ")[0]} 👋</h1>
              <p className="text-gray-400 text-sm mt-1">Gestiona tus cursos y contenido</p>
            </div>
            <a href="/instructor/cursos/nuevo"
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2">
              ➕ Nuevo curso
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total cursos</p>
              <p className="text-3xl font-bold">{cursos.length}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Estudiantes totales</p>
              <p className="text-3xl font-bold text-purple-400">
                {cursos.reduce((a, c) => a + c._count.matriculas, 0)}
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Módulos creados</p>
              <p className="text-3xl font-bold text-cyan-400">
                {cursos.reduce((a, c) => a + c._count.modulos, 0)}
              </p>
            </div>
          </div>

          {/* Lista de cursos */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mis cursos</h2>
            {cargando ? (
              <p className="text-gray-400">Cargando...</p>
            ) : cursos.length === 0 ? (
              <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-12 text-center">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-gray-400 mb-4">No tienes cursos aún</p>
                <a href="/instructor/cursos/nuevo"
                  className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-medium transition">
                  Crear tu primer curso
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {cursos.map(curso => (
                  <div key={curso.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-purple-700 transition">
                    <div>
                      <h3 className="font-medium">{curso.titulo}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {curso._count.modulos} módulos · {curso._count.matriculas} estudiantes
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        curso.estado === "PUBLICADO"
                          ? "text-green-400 border-green-700 bg-green-900/20"
                          : "text-yellow-400 border-yellow-700 bg-yellow-900/20"
                      }`}>
                        {curso.estado}
                      </span>
                      <a href={`/instructor/cursos/${curso.slug}`}
                        className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-xs transition">
                        Editar →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}