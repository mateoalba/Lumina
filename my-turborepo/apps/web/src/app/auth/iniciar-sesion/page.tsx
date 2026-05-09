"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
  const router = useRouter();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/api/auth/iniciar-sesion", form);
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
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-purple-400">✦ Lumina</a>
          <h2 className="text-white text-2xl font-bold mt-4">Bienvenido de vuelta</h2>
          <p className="text-gray-400 mt-1">Inicia sesión para continuar</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={manejarEnvio} className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Correo electrónico</label>
              <input
                name="correo"
                type="email"
                required
                onChange={manejarCambio}
                placeholder="tu@correo.com"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Contraseña</label>
              <input
                name="contrasena"
                type="password"
                required
                onChange={manejarCambio}
                placeholder="Tu contraseña"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
            >
              {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <a href="/auth/registro" className="text-purple-400 hover:text-purple-300">
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}