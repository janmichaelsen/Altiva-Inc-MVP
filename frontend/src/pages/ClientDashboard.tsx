import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, BrainCircuit, CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para saber qué reporte se está analizando ahora mismo
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  // Aquí guardamos los resultados de la IA (temporalmente en pantalla)
  const [resultadosIA, setResultadosIA] = useState<Record<number, any>>({});

  useEffect(() => {
    // 1. Cargar usuario y sus reportes
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchReportes(parsedUser.email);
  }, []);

  const fetchReportes = async (email: string) => {
    try {
      // Pedimos al backend SOLO los reportes de este cliente
      const res = await fetch(`http://localhost:3001/api/mis-reportes?email=${email}`);
      const data = await res.json();
      setReportes(data);
    } catch (error) {
      console.error("Error cargando reportes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalizarConIA = async (reporte: any) => {
    setAnalyzingId(reporte.id);
    
    try {
      // 2. LLAMADA A LA IA (GEMINI)
      const res = await fetch('http://localhost:3001/api/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datosClave: reporte.datosClave // Le mandamos el texto que escribió el admin
        })
      });

      const analisis = await res.json();
      
      // Guardamos el resultado asociado al ID del reporte
      setResultadosIA(prev => ({ ...prev, [reporte.id]: analisis }));

    } catch (error) {
      alert("La IA está ocupada, intenta de nuevo.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Simple */}
      <nav className="bg-blue-900 text-white p-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
            <img src="/logoaltiva.png" alt="Altiva" className="h-8 bg-white rounded p-1"/>
            <span className="font-bold text-lg tracking-wide">Portal Clientes</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-blue-200">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-blue-800 rounded-full transition-colors">
                <LogOut size={20} />
            </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Mis Informes Estratégicos</h1>
            <p className="text-slate-500 mt-2">Revise los documentos asignados y genere análisis en tiempo real.</p>
        </header>

        {loading ? (
            <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-900 mb-2"/> Cargando documentos...</div>
        ) : reportes.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow text-center border border-slate-100">
                <FileText size={48} className="mx-auto text-slate-300 mb-4"/>
                <h3 className="text-lg font-medium text-slate-700">No tienes informes pendientes</h3>
                <p className="text-slate-400">Cuando Altiva te asigne un documento, aparecerá aquí.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {reportes.map((repo) => (
                    <div key={repo.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Cabecera del Reporte */}
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold uppercase">Nuevo</span>
                                    <span className="text-slate-400 text-sm">{repo.fecha}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{repo.titulo}</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-2xl truncate">{repo.datosClave}</p>
                            </div>

                            {/* BOTÓN DE ACCIÓN IA */}
                            {!resultadosIA[repo.id] ? (
                                <button 
                                    onClick={() => handleAnalizarConIA(repo)}
                                    disabled={analyzingId === repo.id}
                                    className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition-all disabled:opacity-70 shadow-lg shadow-blue-900/20"
                                >
                                    {analyzingId === repo.id ? (
                                        <><Loader2 className="animate-spin" size={18}/> Analizando...</>
                                    ) : (
                                        <><BrainCircuit size={18}/> Generar Análisis IA</>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                                    <CheckCircle size={20} /> Análisis Completado
                                </div>
                            )}
                        </div>

                        {/* RESULTADO DE LA IA (Se despliega si existe) */}
                        {resultadosIA[repo.id] && (
                            <div className="bg-slate-50 p-6 animate-in slide-in-from-top-4 duration-500 border-t-4 border-blue-900">
                                <div className="flex items-center gap-3 mb-4">
                                    <BrainCircuit className="text-blue-900" size={24} />
                                    <h4 className="font-bold text-lg text-slate-800">Evaluación de Inteligencia Artificial</h4>
                                    <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${
                                        resultadosIA[repo.id].riesgo === 'Alto' ? 'bg-red-100 text-red-700' :
                                        resultadosIA[repo.id].riesgo === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        Riesgo: {resultadosIA[repo.id].riesgo}
                                    </span>
                                </div>

                                <p className="text-slate-700 mb-6 leading-relaxed font-medium">
                                    {resultadosIA[repo.id].conclusion}
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                        <h5 className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                                            <ArrowRight size={14}/> Pros / Oportunidades
                         <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4"></ul>               </h5>
                                        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                                            {resultadosIA[repo.id].pros?.map((p:string, i:number) => <li key={i}>{p}</li>)}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                        <h5 className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-1">
                                            <AlertTriangle size={14}/> Riesgos Detectados
                                        </h5>
                                        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                                            {resultadosIA[repo.id].contras?.map((c:string, i:number) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                     <span className="text-[10px] text-slate-400 uppercase tracking-widest">Análisis generado por Gemini API</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
