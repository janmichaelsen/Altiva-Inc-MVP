import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ClientDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [insight, setInsight] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/reports', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setReports(data) : setReports([]))
      .catch(err => console.error(err));
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mis Informes Estratégicos</h1>
        <p className="text-slate-500">Gestión de documentos e inteligencia de negocios.</p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 && <div className="p-8 text-center bg-slate-100 rounded text-slate-500">No hay reportes disponibles.</div>}
        
        {reports.map(report => (
          <div key={report.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === report.id ? null : report.id)}>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg"><FileText size={24} /></div>
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
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Contexto del Analista</h4>
                  <div className="text-sm text-slate-600 bg-white p-4 rounded border border-slate-200 italic">
                    "{report.ai_context || 'Sin contexto disponible.'}"
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-purple-600 uppercase mb-2 flex items-center gap-2"><Sparkles size={14}/> Altiva AI Insights</h4>
                  {!insight[report.id] ? (
                    <div className="text-center bg-white p-6 rounded border border-purple-100 shadow-sm">
                      <p className="mb-4 text-sm text-slate-600">Genera un resumen ejecutivo instantáneo basado en los datos del reporte.</p>
                      <Button onClick={() => generate(report)} disabled={generating} className="bg-purple-600 hover:bg-purple-700 w-full">
                        {generating ? 'Analizando...' : 'Generar Insight IA'}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white rounded border border-purple-200 overflow-hidden shadow-sm animate-in fade-in">
                      <div className="p-4 bg-purple-50 text-sm text-slate-800 leading-relaxed">{insight[report.id]}</div>
                      <div className="bg-amber-50 p-2 text-xs text-amber-800 flex items-center gap-2 border-t border-amber-100">
                        <AlertTriangle size={12}/> Disclaimer: Generado por IA. Verificar con consultor.
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
