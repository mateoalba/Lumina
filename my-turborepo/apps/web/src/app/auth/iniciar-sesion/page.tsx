"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
  const router = useRouter();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await axios.post(
        "https://auth-production-5c8b.up.railway.app/api/auth/iniciar-sesion",
        form
      );
      localStorage.setItem("token", res.data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.datos.usuario));
      router.push("/tablero");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Credenciales inválidas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-10">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">

        {/* Panel izquierdo */}
        <div
          className="hidden lg:flex w-5/12 flex-col justify-between p-8 relative overflow-hidden"
          style={{ background: "#0d1b2e" }}
        >
          {/* Fondo decorativo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(99,67,220,0.25) 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(76,215,246,0.12) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(180,160,255,0.15) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(180,160,255,0.15) 0px, transparent 1px, transparent 40px)",
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <a href="/" className="text-xl font-bold text-purple-300">✦ Lumina</a>
          </div>

          {/* Contenido central */}
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-blue-100 leading-snug mb-3">
              Eleva tu aprendizaje con precisión de IA.
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Únete a una comunidad de profesionales dominando nuevas habilidades en un ecosistema educativo de alto nivel.
            </p>
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(99,67,220,0.18)",
                border: "0.5px solid rgba(195,192,255,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                  ✦ Motor de insights activo
                </span>
              </div>
              <p className="text-xs text-blue-200 opacity-70 italic leading-relaxed">
                "La transición de datos a conocimiento ahora es fluida. Bienvenido al futuro del crecimiento cognitivo."
              </p>
            </div>
          </div>

          {/* Avatares */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex">
              {["MA", "LP", "CR"].map((ini, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-purple-300 border-2"
                  style={{
                    background: "#3e3c8f",
                    borderColor: "#0d1b2e",
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {ini}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              Más de 12,000 profesionales confían en Lumina
            </span>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-8 lg:p-10">
          <div className="w-full max-w-sm">

            {/* Branding mobile */}
            <div className="lg:hidden text-center mb-6">
              <a href="/" className="text-xl font-bold text-purple-400">✦ Lumina</a>
            </div>

            <h1 className="text-2xl font-semibold text-white mb-1">Iniciar sesión</h1>
            <p className="text-sm text-gray-400 mb-6">
              Accede a tu espacio de aprendizaje personalizado
            </p>

            {/* Botones sociales */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-700 text-gray-300 text-xs font-medium hover:bg-gray-800 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-700 text-gray-300 text-xs font-medium hover:bg-gray-800 transition"
              >
                <svg width="16" height="16" viewBox="0 0 23 23" fill="#0078d4">
                  <path d="M11 11H0V0h11v11zm12 0H12V0h11v11zM11 23H0V12h11v11zm12 0H12V12h11v11z"/>
                </svg>
                Microsoft
              </button>
            </div>

            {/* Divisor */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-xs text-gray-500 tracking-widest">O CON CORREO</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={manejarEnvio} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 tracking-widest uppercase mb-2">
                  Correo electrónico
                </label>
                <input
                  name="correo"
                  type="email"
                  required
                  onChange={manejarCambio}
                  placeholder="nombre@empresa.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition placeholder-gray-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                    Contraseña
                  </label>
                  <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <input
                    name="contrasena"
                    type={mostrarContrasena ? "text" : "password"}
                    required
                    onChange={manejarCambio}
                    placeholder="••••••••"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition placeholder-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {mostrarContrasena ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recordar"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-purple-500"
                />
                <label htmlFor="recordar" className="text-sm text-gray-400 cursor-pointer select-none">
                  Recordarme por 30 días
                </label>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition text-sm"
              >
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿Nuevo en Lumina?{" "}
              <a href="/auth/registro" className="text-purple-400 font-semibold hover:text-purple-300 transition">
                Crear una cuenta
              </a>
            </p>

            <p className="text-center text-xs text-gray-700 mt-6 tracking-widest uppercase">
              © 2025 Lumina · Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}