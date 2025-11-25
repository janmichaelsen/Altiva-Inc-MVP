import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, DollarSign, Coins, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Indicator {
  valor: number;
  nombre: string;
  unidad_medida: string;
}

export default function ClientDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [insight, setInsight] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  
  // Estado para la API Externa
  const [indicators, setIndicators] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  // Función para cargar reportes
  const fetchReportes = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log("Cargando reportes para:", user.email); // Debug

    try {
      const res = await fetch(`http://localhost:3000/api/reports`, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      
      if (!res.ok) throw new Error('Error al obtener reportes');
      
      const data = await res.json();
      console.log("Reportes recibidos:", data); // Debug
      
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Error cargando reportes", err);
    }
  };

  useEffect(() => {
    fetchReportes();

    // Cargar API Externa
    fetch('https://mindicador.cl/api')
      .then(res => res.json())
      .then(data => {
        setIndicators(data);
        setLoadingIndicators(false);
      })
      .catch(err => {
        console.error("Error cargando indicadores", err);
        setLoadingIndicators(false);
      });
  }, []);

  const generate = async (report: any) => {
    setGenerating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ keyData: report.ai_context })
      });
      const data = await res.json();
      setInsight({ ...insight, [report.id]: data.summary });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const IndicatorCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">
          {value ? `$${value.toLocaleString('es-CL')}` : '...'}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hola, Cliente</h1>
          <p className="text-slate-500">Bienvenido a tu panel de inteligencia comercial.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <Activity size={16} />
          Sistema Operativo
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={20}/> Indicadores Económicos (Tiempo Real)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IndicatorCard title="Valor Dólar (USD)" value={indicators?.dolar?.valor} icon={DollarSign} color="bg-green-100 text-green-600" />
          <IndicatorCard title="Valor UF" value={indicators?.uf?.valor} icon={TrendingUp} color="bg-blue-100 text-blue-600" />
          <IndicatorCard title="Valor Euro" value={indicators?.euro?.valor} icon={Coins} color="bg-indigo-100 text-indigo-600" />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-right">Fuente: mindicador.cl API</p>
      </div>

      <hr className="border-slate-200" />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Mis Informes Asignados</h2>
          <Button variant="outline" size="sm" onClick={fetchReportes}>Actualizar Lista</Button>
        </div>
        
        {reports.length === 0 && (
          <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No hay reportes disponibles todavía.</p>
            <p className="text-sm text-slate-400">Contacte a su ejecutivo en Altiva Inc.</p>
          </div>
        )}
        
        {reports.map(report => (
          <div key={report.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-5 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50/50" onClick={() => setExpanded(expanded === report.id ? null : report.id)}>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100"><FileText size={24} /></div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{report.title}</h3>
                  <p className="text-sm text-slate-500">Publicado: {new Date(report.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {expanded === report.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </div>
            
            {expanded === report.id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-2">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Contexto del Analista</h4>
                  <div className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200 italic leading-relaxed">
                    "{report.ai_context || 'Sin contexto disponible.'}"
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-purple-600 uppercase mb-2 flex items-center gap-2 tracking-wider"><Sparkles size={14}/> Altiva AI Insights</h4>
                  {!insight[report.id] ? (
                    <div className="text-center bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
                      <p className="mb-4 text-sm text-slate-600">Genera un resumen ejecutivo instantáneo basado en los datos del reporte.</p>
                      <Button onClick={() => generate(report)} disabled={generating} className="bg-purple-600 hover:bg-purple-700 w-full shadow-purple-100">
                        {generating ? 'Analizando datos...' : 'Generar Insight IA'}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-purple-200 overflow-hidden shadow-sm animate-in fade-in">
                      <div className="p-4 bg-purple-50 text-sm text-slate-800 leading-relaxed">{insight[report.id]}</div>
                      <div className="bg-amber-50 p-2 text-xs text-amber-800 flex items-center gap-2 border-t border-amber-100 px-4">
                        <AlertTriangle size={12}/> Disclaimer: Generado por IA. Verificar con consultor humano.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}