"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NuevoCurso() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    nivel: "principiante",
    esGratuito: true,
    precio: 0,
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!usuario || !token) { router.push("/auth/iniciar-sesion"); return; }
    const u = JSON.parse(usuario);
    if (u.rol !== "INSTRUCTOR" && u.rol !== "ADMINISTRADOR") router.push("/tablero");
  }, [router]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const datos = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        nivel: form.nivel,
        esGratuito: form.esGratuito,
        ...(form.esGratuito ? {} : { precio: Number(form.precio) }),
      };
      const res = await axios.post("http://localhost:3002/api/cursos", datos, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push(`/instructor/cursos/${res.data.datos.slug}`);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || JSON.stringify(err.response?.data?.error) || "Error al crear el curso");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <a href="/" className="text-lg font-bold text-purple-400">✦ Lumina</a>
          <p className="text-xs text-gray-500 mt-1">Portal Instructor</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <a href="/instructor" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 rounded-lg text-sm transition">
            📊 Dashboard
          </a>
          <a href="/instructor/cursos/nuevo" className="flex items-center gap-3 px-3 py-2.5 bg-purple-900/40 text-purple-300 rounded-lg text-sm font-medium">
            ➕ Nuevo curso
          </a>
          <a href="/cursos" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 rounded-lg text-sm transition">
            🎓 Ver plataforma
          </a>
        </nav>
      </aside>

      {/* Formulario */}
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <a href="/instructor" className="text-gray-400 hover:text-white text-sm transition">
              ← Volver al dashboard
            </a>
            <h1 className="text-2xl font-bold mt-3">Crear nuevo curso</h1>
            <p className="text-gray-400 text-sm mt-1">Completa la información básica de tu curso</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Información del curso</h2>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Título del curso</label>
                <input
                  name="titulo"
                  type="text"
                  required
                  value={form.titulo}
                  onChange={manejarCambio}
                  placeholder="Ej: Introducción a TypeScript"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  rows={4}
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Describe qué aprenderán los estudiantes en este curso..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition placeholder-gray-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Nivel</label>
                <select
                  name="nivel"
                  value={form.nivel}
                  onChange={manejarCambio}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Precio</h2>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="esGratuito"
                  name="esGratuito"
                  checked={form.esGratuito}
                  onChange={manejarCambio}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="esGratuito" className="text-sm text-gray-300 cursor-pointer">
                  Este curso es gratuito
                </label>
              </div>
              {!form.esGratuito && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Precio (USD)</label>
                  <input
                    name="precio"
                    type="number"
                    min="0"
                    value={form.precio}
                    onChange={manejarCambio}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/instructor")}
                className="flex-1 border border-gray-700 hover:bg-gray-800 py-3 rounded-lg text-sm font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg text-sm font-medium transition"
              >
                {cargando ? "Creando curso..." : "Crear curso →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}