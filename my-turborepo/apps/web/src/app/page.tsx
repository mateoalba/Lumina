export default function Inicio() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navegación */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-400">✦ Lumina</h1>
        <div className="flex gap-4">
          <a href="/auth/iniciar-sesion" className="text-gray-300 hover:text-white transition">
            Iniciar sesión
          </a>
          <a href="/auth/registro" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
            Registrarse
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="bg-purple-900/50 text-purple-300 text-sm px-4 py-1 rounded-full border border-purple-700">
          Plataforma LMS con IA integrada
        </span>
        <h2 className="text-5xl font-bold mt-6 mb-4 leading-tight">
          Aprende a tu ritmo con un
          <span className="text-purple-400"> tutor inteligente</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Lumina analiza tu rendimiento y te da retroalimentación personalizada 
          en cada lección. Como tener un tutor disponible las 24 horas.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/auth/registro" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-medium transition text-lg">
            Comenzar gratis
          </a>
          <a href="/cursos" className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg font-medium transition text-lg">
            Ver cursos
          </a>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Aprendizaje personalizado</h3>
          <p className="text-gray-400 text-sm">La IA adapta el contenido según tu nivel y velocidad de aprendizaje.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold mb-2">Tutor IA disponible 24/7</h3>
          <p className="text-gray-400 text-sm">Pregunta cualquier duda sobre el curso y recibe respuestas inmediatas.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Seguimiento de progreso</h3>
          <p className="text-gray-400 text-sm">Visualiza tu avance en tiempo real con métricas detalladas.</p>
        </div>
      </section>
    </main>
  );
}