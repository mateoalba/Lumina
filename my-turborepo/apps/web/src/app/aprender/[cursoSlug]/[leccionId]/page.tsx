"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Leccion {
  id: string;
  titulo: string;
  tipo: string;
  contenido: string | null;
  urlVideo: string | null;
  duracion: number | null;
  esGratuita: boolean;
  orden: number;
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
  slug: string;
  instructor: { nombreCompleto: string };
  modulos: Modulo[];
}

export default function PaginaLeccion({
  params,
}: {
  params: { cursoSlug: string; leccionId: string };
}) {
  const router = useRouter();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [leccionActual, setLeccionActual] = useState<Leccion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState<"descripcion" | "notas" | "recursos">("descripcion");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/auth/iniciar-sesion"); return; }
    axios.get(`http://localhost:3002/api/cursos/${params.cursoSlug}`)
      .then(res => {
        const c: Curso = res.data.datos;
        setCurso(c);
        const todasLecciones = c.modulos.flatMap(m => m.lecciones);
        const leccion = todasLecciones.find(l => l.id === params.leccionId);
        if (leccion) setLeccionActual(leccion);
        else if (todasLecciones.length > 0) {
          router.push(`/aprender/${params.cursoSlug}/${todasLecciones[0].id}`);
        }
      })
      .catch(() => router.push("/cursos"))
      .finally(() => setCargando(false));
  }, [params.cursoSlug, params.leccionId]);

  const todasLecciones = curso?.modulos.flatMap(m => m.lecciones) || [];
  const indiceActual = todasLecciones.findIndex(l => l.id === params.leccionId);
  const leccionAnterior = indiceActual > 0 ? todasLecciones[indiceActual - 1] : null;
  const leccionSiguiente = indiceActual < todasLecciones.length - 1 ? todasLecciones[indiceActual + 1] : null;

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const formatDuracion = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center text-white" style={{ background: "#081425" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Cargando lección...</p>
      </div>
    </div>
  );

  if (!curso || !leccionActual) return null;

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: "#081425", color: "#d8e3fb" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b flex items-center justify-between px-6 h-16"
        style={{ background: "rgba(8,20,37,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(71,70,81,0.3)" }}>
        <div className="flex items-center gap-6">
          <a href="/" className="text-xl font-bold" style={{ color: "#c3c0ff" }}>Lumina</a>
          <nav className="hidden md:flex gap-6 items-center h-full">
            <a href="/tablero" className="text-sm font-bold border-b-2 h-full flex items-center px-1"
              style={{ color: "#c3c0ff", borderColor: "#c3c0ff" }}>Mi aprendizaje</a>
            <a href="/cursos" className="text-sm hover:text-white transition" style={{ color: "#c8c5d3" }}>Cursos</a>
            <a href="/chat" className="text-sm hover:text-white transition" style={{ color: "#c8c5d3" }}>Comunidad</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm"
            style={{ background: "rgba(31,42,60,0.5)", borderColor: "rgba(71,70,81,0.2)", color: "#918f9c" }}>
            🔍 <span>Buscar...</span>
          </div>
          <a href="/tablero" className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-80 transition text-lg"
            style={{ color: "#c8c5d3" }}>👤</a>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">

        {/* Canvas izquierdo */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Video / Contenido */}
          <section className="relative rounded-xl overflow-hidden shadow-xl"
            style={{ aspectRatio: "16/9", background: "#000", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}>
            {leccionActual.tipo === "VIDEO" && leccionActual.urlVideo ? (
              getYoutubeId(leccionActual.urlVideo) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(leccionActual.urlVideo)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={leccionActual.titulo}
                />
              ) : (
                <video src={leccionActual.urlVideo} controls className="w-full h-full" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center relative group">
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(135deg, #0d1b35 0%, #1a1040 50%, #0a2040 100%)"
                }} />
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "radial-gradient(circle at 30% 50%, rgba(99,67,220,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(76,215,246,0.2) 0%, transparent 50%)"
                }} />
                <button className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110"
                  style={{ background: "rgba(195,192,255,0.15)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.2)" }}>
                  <span className="text-4xl ml-1">▶</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <div className="h-full w-2/3 rounded-full" style={{
                    background: "#c3c0ff",
                    boxShadow: "0 0 10px rgba(195,192,255,0.8)"
                  }} />
                </div>
              </div>
            )}
          </section>

          {/* Info de la lección */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#4cd7f6" }}>
                  {curso.titulo}
                </p>
                <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#d8e3fb" }}>
                  {leccionActual.titulo}
                </h1>
              </div>
              <div className="flex gap-2 shrink-0">
                {leccionAnterior && (
                  <a href={`/aprender/${curso.slug}/${leccionAnterior.id}`}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition hover:opacity-80"
                    style={{ borderColor: "#474651", color: "#d8e3fb" }}>
                    ← Anterior
                  </a>
                )}
                {leccionSiguiente && (
                  <a href={`/aprender/${curso.slug}/${leccionSiguiente.id}`}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition hover:brightness-110"
                    style={{ background: "#c3c0ff", color: "#272377" }}>
                    Siguiente →
                  </a>
                )}
                {!leccionSiguiente && (
                  <a href="/tablero"
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition hover:brightness-110"
                    style={{ background: "#4cd7f6", color: "#003640" }}>
                    🎉 Finalizar
                  </a>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b mt-1" style={{ borderColor: "rgba(71,70,81,0.3)" }}>
              {[
                { key: "descripcion", label: "📄 Descripción" },
                { key: "notas", label: "✨ Notas IA" },
                { key: "recursos", label: "📁 Recursos" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTabActiva(tab.key as any)}
                  className="pb-2 text-sm transition-all"
                  style={{
                    color: tabActiva === tab.key ? "#c3c0ff" : "#918f9c",
                    borderBottom: tabActiva === tab.key ? "2px solid #c3c0ff" : "2px solid transparent",
                    fontWeight: tabActiva === tab.key ? 700 : 400,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido de tabs */}
            <div className="py-3">
              {tabActiva === "descripcion" && (
                <div className="rounded-xl p-5" style={{
                  background: "rgba(49,46,129,0.2)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#4cd7f6" }}>🧠</span>
                    <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4cd7f6" }}>
                      Concepto clave
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#c8c5d3" }}>
                    {leccionActual.contenido || "El instructor aún no ha agregado una descripción para esta lección."}
                  </p>
                  {leccionActual.duracion && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="rounded-lg p-3" style={{ background: "#111c2d", border: "1px solid rgba(71,70,81,0.2)" }}>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#918f9c" }}>Tipo</p>
                        <p className="text-sm font-medium">{leccionActual.tipo}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "#111c2d", border: "1px solid rgba(71,70,81,0.2)" }}>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#918f9c" }}>Duración</p>
                        <p className="text-sm font-medium">{formatDuracion(leccionActual.duracion)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tabActiva === "notas" && (
                <div className="rounded-xl p-5 text-center" style={{
                  background: "rgba(49,46,129,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <p className="text-3xl mb-3">🤖</p>
                  <p className="text-sm mb-3" style={{ color: "#c8c5d3" }}>
                    El tutor IA puede generar notas y resúmenes de esta lección.
                  </p>
                  <a href="/chat"
                    className="inline-block px-5 py-2 rounded-lg text-sm font-medium transition hover:brightness-110"
                    style={{ background: "#571bc1", color: "#c4abff" }}>
                    Abrir tutor IA
                  </a>
                </div>
              )}

              {tabActiva === "recursos" && (
                <div className="rounded-xl p-5 text-center" style={{
                  background: "rgba(49,46,129,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <p className="text-3xl mb-3">📁</p>
                  <p className="text-sm" style={{ color: "#c8c5d3" }}>
                    No hay recursos adicionales para esta lección.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar derecho */}
        <aside className="w-full md:w-80 flex flex-col gap-3 shrink-0">
          <div className="rounded-xl overflow-hidden flex flex-col" style={{
            background: "#111c2d",
            border: "1px solid rgba(71,70,81,0.2)"
          }}>
            {/* Header sidebar */}
            <div className="p-4 border-b" style={{ background: "rgba(31,42,60,0.3)", borderColor: "rgba(71,70,81,0.3)" }}>
              <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#d8e3fb" }}>
                Temario del curso
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(71,70,81,0.3)" }}>
                  <div className="h-full rounded-full" style={{
                    background: "#4cd7f6",
                    width: `${todasLecciones.length > 0 ? ((indiceActual + 1) / todasLecciones.length) * 100 : 0}%`
                  }} />
                </div>
                <span className="text-xs" style={{ color: "#918f9c" }}>
                  {indiceActual + 1}/{todasLecciones.length}
                </span>
              </div>
            </div>

            {/* Lista de lecciones */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-96 md:max-h-full">
              {curso.modulos.map(modulo => (
                <div key={modulo.id}>
                  <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase" style={{ color: "#4cd7f6" }}>
                    {modulo.titulo}
                  </p>
                  {modulo.lecciones.map((leccion, i) => {
                    const esActual = leccion.id === params.leccionId;
                    const indiceGlobal = todasLecciones.findIndex(l => l.id === leccion.id);
                    const completada = indiceGlobal < indiceActual;
                    return (
                    <a
                        key={leccion.id}
                        href={`/aprender/${curso.slug}/${leccion.id}`}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                        style={{
                          background: esActual ? "#312e81" : "transparent",
                          borderLeft: esActual ? "4px solid #c3c0ff" : "4px solid transparent",
                          opacity: 1,
                        }}
                      >
                        <span className="text-lg shrink-0">
                          {completada ? "✅" : esActual ? "▶️" : "🔒"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{
                            color: esActual ? "#9c9af4" : completada ? "#d8e3fb" : "#c8c5d3",
                            fontWeight: esActual ? 700 : 400,
                          }}>
                            {leccion.titulo}
                          </p>
                          <p className="text-xs uppercase tracking-wider" style={{ color: "#918f9c" }}>
                            {leccion.duracion ? formatDuracion(leccion.duracion) : leccion.tipo}
                            {completada ? " • Completada" : esActual ? " • Viendo ahora" : ""}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Instructor */}
            <div className="p-4 border-t" style={{ background: "rgba(31,42,60,0.3)", borderColor: "rgba(71,70,81,0.3)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "#312e81", color: "#c3c0ff", border: "1px solid rgba(195,192,255,0.3)" }}>
                  {curso.instructor?.nombreCompleto?.charAt(0) || "I"}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#d8e3fb" }}>
                    {curso.instructor?.nombreCompleto || "Instructor"}
                  </p>
                  <p className="text-xs" style={{ color: "#918f9c" }}>Instructor del curso</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* FAB tutor IA */}
      <a href="/chat"
        className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl z-50 transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #571bc1 0%, #312e81 100%)",
          boxShadow: "0 10px 30px rgba(87,27,193,0.4)"
        }}>
        <span className="text-xl">🧠</span>
        <span className="text-sm font-bold" style={{ color: "#fff" }}>Preguntar al tutor IA</span>
      </a>
    </div>
  );
}