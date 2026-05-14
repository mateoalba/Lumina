"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Leccion {
  id: string;
  titulo: string;
  tipo: string;
  orden: number;
  duracion: number | null;
}

interface Modulo {
  id: string;
  titulo: string;
  orden: number;
  lecciones: Leccion[];
}

interface Curso {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: string;
  nivel: string | null;
  slug: string;
  modulos: Modulo[];
}

export default function EditorCurso({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [moduloAbierto, setModuloAbierto] = useState<string | null>(null);

  // Estados para modales
  const [mostrarModalModulo, setMostrarModalModulo] = useState(false);
  const [mostrarModalLeccion, setMostrarModalLeccion] = useState(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string>("");

  // Formularios
  const [formModulo, setFormModulo] = useState({ titulo: "", descripcion: "" });
  const [formLeccion, setFormLeccion] = useState({
    titulo: "",
    tipo: "VIDEO" as "VIDEO" | "LECTURA" | "CUESTIONARIO",
    contenido: "",
    urlVideo: "",
    duracion: 0,
    esGratuita: false,
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    if (!token || !usuario) { router.push("/auth/iniciar-sesion"); return; }
    const u = JSON.parse(usuario);
    if (u.rol !== "INSTRUCTOR" && u.rol !== "ADMINISTRADOR") { router.push("/tablero"); return; }

    cargarCurso(token);
  }, [params.slug]);

  const cargarCurso = async (token: string) => {
    try {
      const res = await axios.get(`http://localhost:3002/api/cursos/${params.slug}`);
      setCurso(res.data.datos);
      if (res.data.datos.modulos.length > 0) {
        setModuloAbierto(res.data.datos.modulos[0].id);
      }
    } catch {
      router.push("/instructor");
    } finally {
      setCargando(false);
    }
  };

  const crearModulo = async () => {
    if (!formModulo.titulo.trim()) return;
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3002/api/cursos/${curso!.id}/modulos`,
        formModulo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMostrarModalModulo(false);
      setFormModulo({ titulo: "", descripcion: "" });
      setMensaje("Módulo creado exitosamente");
      cargarCurso(token!);
      setTimeout(() => setMensaje(""), 3000);
    } catch (err: any) {
      setMensaje(err.response?.data?.mensaje || "Error al crear módulo");
    } finally {
      setGuardando(false);
    }
  };

  const crearLeccion = async () => {
    if (!formLeccion.titulo.trim() || !moduloSeleccionado) return;
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3002/api/cursos/modulos/${moduloSeleccionado}/lecciones`,
        formLeccion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMostrarModalLeccion(false);
      setFormLeccion({ titulo: "", tipo: "VIDEO", contenido: "", urlVideo: "", duracion: 0, esGratuita: false });
      setMensaje("Lección creada exitosamente");
      cargarCurso(token!);
      setTimeout(() => setMensaje(""), 3000);
    } catch (err: any) {
      setMensaje(err.response?.data?.mensaje || "Error al crear lección");
    } finally {
      setGuardando(false);
    }
  };

  const iconoLeccion = (tipo: string) => {
    if (tipo === "VIDEO") return "🎬";
    if (tipo === "LECTURA") return "📄";
    return "❓";
  };

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      Cargando editor...
    </div>
  );

  if (!curso) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <a href="/instructor" className="text-purple-400 font-bold text-lg">✦ Lumina</a>
          <div className="w-px h-5 bg-gray-700" />
          <span className="text-white font-medium text-sm truncate max-w-xs">{curso.titulo}</span>
          <span className={`text-xs px-2 py-0.5 rounded border ${
            curso.estado === "PUBLICADO"
              ? "text-green-400 border-green-700 bg-green-900/20"
              : "text-yellow-400 border-yellow-700 bg-yellow-900/20"
          }`}>
            {curso.estado}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {mensaje && (
            <span className={`text-xs px-3 py-1.5 rounded-lg ${
              mensaje.includes("exitosamente")
                ? "bg-green-900/30 text-green-400 border border-green-700"
                : "bg-red-900/30 text-red-400 border border-red-700"
            }`}>
              {mensaje}
            </span>
          )}
          <a href={`/cursos/${curso.slug}`} target="_blank"
            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition">
            Vista previa →
          </a>
          <a href="/instructor" className="text-xs text-gray-400 hover:text-white transition">
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo - Curriculum */}
        <aside className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Curriculum</h2>
            <button
              onClick={() => setMostrarModalModulo(true)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
            >
              ➕ Módulo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {curso.modulos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm mb-3">No hay módulos aún</p>
                <button
                  onClick={() => setMostrarModalModulo(true)}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                >
                  Crear primer módulo
                </button>
              </div>
            ) : (
              curso.modulos.map(modulo => (
                <div key={modulo.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setModuloAbierto(moduloAbierto === modulo.id ? null : modulo.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition text-left"
                  >
                    <span className="text-gray-400 text-sm">{moduloAbierto === modulo.id ? "▼" : "▶"}</span>
                    <span className="flex-1 text-sm font-medium truncate">{modulo.titulo}</span>
                    <span className="text-xs text-gray-500">{modulo.lecciones.length}</span>
                  </button>

                  {moduloAbierto === modulo.id && (
                    <div className="border-t border-gray-700">
                      {modulo.lecciones.map(leccion => (
                        <div key={leccion.id}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700/50 transition border-b border-gray-700/50 last:border-0">
                          <span className="text-sm">{iconoLeccion(leccion.tipo)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-200 truncate">{leccion.titulo}</p>
                            <p className="text-xs text-gray-500 uppercase">{leccion.tipo}</p>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => { setModuloSeleccionado(modulo.id); setMostrarModalLeccion(true); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-purple-400 hover:bg-purple-900/20 transition border-t border-gray-700"
                      >
                        ➕ Agregar lección
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Panel principal */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            {curso.modulos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">📚</p>
                <h2 className="text-xl font-semibold mb-2">Empieza a construir tu curso</h2>
                <p className="text-gray-400 text-sm mb-6">Crea módulos para organizar el contenido y agrega lecciones dentro de cada uno.</p>
                <button
                  onClick={() => setMostrarModalModulo(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-sm font-medium transition"
                >
                  Crear primer módulo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Resumen del curso</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{curso.modulos.length}</p>
                      <p className="text-xs text-gray-500 mt-1">Módulos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">
                        {curso.modulos.reduce((a, m) => a + m.lecciones.length, 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Lecciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {curso.modulos.reduce((a, m) => a + m.lecciones.filter(l => l.tipo === "VIDEO").length, 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Videos</p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-purple-900/30 to-gray-900 border border-purple-800/50 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm mb-1">🤖 Asistente IA</h3>
                    <p className="text-xs text-gray-400">Genera preguntas de quiz o resume el contenido de tus lecciones.</p>
                  </div>
                  <a href="/chat"
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap">
                    Abrir IA
                  </a>
                </div>

                {curso.modulos.map(modulo => (
                  <div key={modulo.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                      <h3 className="font-medium">{modulo.titulo}</h3>
                      <button
                        onClick={() => { setModuloSeleccionado(modulo.id); setMostrarModalLeccion(true); }}
                        className="text-xs text-purple-400 hover:text-purple-300 transition"
                      >
                        ➕ Lección
                      </button>
                    </div>
                    {modulo.lecciones.length === 0 ? (
                      <p className="text-center text-gray-500 text-sm py-6">Sin lecciones aún</p>
                    ) : (
                      modulo.lecciones.map((leccion, i) => (
                        <div key={leccion.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition">
                          <span className="text-gray-500 text-xs w-5">{i + 1}</span>
                          <span>{iconoLeccion(leccion.tipo)}</span>
                          <div className="flex-1">
                            <p className="text-sm">{leccion.titulo}</p>
                            <p className="text-xs text-gray-500 uppercase">{leccion.tipo}</p>
                          </div>
                          {leccion.duracion && (
                            <span className="text-xs text-gray-500">{Math.floor(leccion.duracion / 60)} min</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal crear módulo */}
      {mostrarModalModulo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-5">Nuevo módulo</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Título</label>
                <input
                  type="text"
                  value={formModulo.titulo}
                  onChange={e => setFormModulo({ ...formModulo, titulo: e.target.value })}
                  placeholder="Ej: Introducción al tema"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Descripción (opcional)</label>
                <textarea
                  value={formModulo.descripcion}
                  onChange={e => setFormModulo({ ...formModulo, descripcion: e.target.value })}
                  placeholder="Describe el módulo..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setMostrarModalModulo(false)}
                className="flex-1 border border-gray-700 hover:bg-gray-800 py-2.5 rounded-lg text-sm transition">
                Cancelar
              </button>
              <button onClick={crearModulo} disabled={guardando}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2.5 rounded-lg text-sm font-medium transition">
                {guardando ? "Creando..." : "Crear módulo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear lección */}
      {mostrarModalLeccion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-5">Nueva lección</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Título</label>
                <input
                  type="text"
                  value={formLeccion.titulo}
                  onChange={e => setFormLeccion({ ...formLeccion, titulo: e.target.value })}
                  placeholder="Ej: Introducción al tema"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Tipo</label>
                <select
                  value={formLeccion.tipo}
                  onChange={e => setFormLeccion({ ...formLeccion, tipo: e.target.value as any })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="VIDEO">🎬 Video</option>
                  <option value="LECTURA">📄 Lectura</option>
                  <option value="CUESTIONARIO">❓ Cuestionario</option>
                </select>
              </div>
              {formLeccion.tipo === "VIDEO" && (
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">URL del video</label>
                  <input
                    type="url"
                    value={formLeccion.urlVideo}
                    onChange={e => setFormLeccion({ ...formLeccion, urlVideo: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Contenido</label>
                <textarea
                  value={formLeccion.contenido}
                  onChange={e => setFormLeccion({ ...formLeccion, contenido: e.target.value })}
                  placeholder="Descripción o contenido de la lección..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Duración (seg)</label>
                  <input
                    type="number"
                    value={formLeccion.duracion}
                    onChange={e => setFormLeccion({ ...formLeccion, duracion: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formLeccion.esGratuita}
                      onChange={e => setFormLeccion({ ...formLeccion, esGratuita: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm text-gray-300">Lección gratuita</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setMostrarModalLeccion(false)}
                className="flex-1 border border-gray-700 hover:bg-gray-800 py-2.5 rounded-lg text-sm transition">
                Cancelar
              </button>
              <button onClick={crearLeccion} disabled={guardando}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2.5 rounded-lg text-sm font-medium transition">
                {guardando ? "Creando..." : "Crear lección"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}