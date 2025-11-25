import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Database, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario: Ahora usamos clientEmail en lugar de solo clientId
  const [form, setForm] = useState({ 
    title: '', 
    clientEmail: 'cliente1@agricola.cl', // Valor por defecto válido
    keyData: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. CONEXIÓN AL BACKEND (Puerto 3001)
      const response = await fetch('http://localhost:3001/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          titulo: form.title, 
          clienteEmail: form.clientEmail, // Enviamos el correo del cliente
          datosClave: form.keyData 
        })
      });

      if (response.ok) {
        alert("✅ Informe asignado correctamente.");
        navigate('/dashboard'); 
      } else {
        alert("Error al guardar el reporte.");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor (3001)");
    } finally {
      setLoading(false);
    }
  };

  // El botón ahora no se deshabilita si no hay archivo (disabled={loading})
  return (
    <div className="min-h-screen bg-slate-50 p-6">
       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        
        {/* Encabezado */}
        <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Nuevo Informe Estratégico</h1>
                <p className="text-blue-200 text-sm">Asignar datos para análisis IA.</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft />
            </button>
        </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* ZONA DE CARGA DE ARCHIVO (VISUAL/FAKE) */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center bg-slate-50 hover:bg-blue-50 cursor-pointer relative transition-all group">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setFileName(e.target.files[0].name);
                }
            }}
          />
          
          {fileName ? (
            <div className="flex flex-col items-center justify-center text-green-600">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <FileText size={32}/> 
              </div>
              <span className="font-bold text-lg">{fileName}</span>
              <span className="text-sm text-green-700 flex items-center gap-1 mt-1">
                <CheckCircle size={14}/> Archivo seleccionado
              </span>
            </div>
          ) : (
            <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
              <UploadCloud className="mx-auto mb-4 h-16 w-16"/>
              <span className="font-bold text-lg text-slate-700 block">Subir PDF del Informe (Simulado)</span>
              <p className="text-sm mt-2">Arrastra o haz clic aquí</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Título del Reporte</label>
            <input 
                placeholder="Ej: Análisis Cobre 2025" 
                className="border border-slate-300 p-3 rounded-lg w-full outline-none focus:ring-2 ring-blue-900 transition-all" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required
            />
          </div>
          
          {/* EL CAMBIO CRÍTICO: DE SELECT A INPUT DE EMAIL */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Asignar a Cliente (EMAIL)</label>
            <input 
                type="email" // <--- Campo de texto para el correo
                placeholder="Ej: agricola1@gmail.com o usuario@google.com"
                className="border border-slate-300 p-3 rounded-lg w-full outline-none focus:ring-2 ring-blue-900 transition-all" 
                value={form.clientEmail}
                onChange={e => setForm({...form, clientEmail: e.target.value})}
                required
            />
             <p className="text-xs text-slate-400 mt-1">Debe ser el email exacto del cliente registrado.</p>
          </div>
          {/* FIN DEL CAMBIO */}
        </div>

        {/* DATOS CLAVE PARA LA IA */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 relative overflow-hidden">
          
          <div className="flex gap-2 mb-3 font-bold text-blue-900 items-center relative z-10">
            <Database size={20}/> Datos Clave (Contexto IA)
          </div>
          
          <p className="text-sm text-blue-700 mb-3 relative z-10">
            Escribe aquí el resumen que leerá la IA para generar el reporte final.
          </p>
          
          <textarea 
            className="w-full p-4 border border-blue-200 rounded-lg h-32 text-sm focus:ring-2 ring-blue-900 outline-none relative z-10" 
            placeholder="Ej: Mercado saturado, precios bajos..." 
            value={form.keyData} 
            onChange={e => setForm({...form, keyData: e.target.value})} 
            required
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            disabled={loading} // Ya no se bloquea si no hay archivo, solo si carga
            className="px-8 py-3 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Guardando...' : 'Guardar y Asignar'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
