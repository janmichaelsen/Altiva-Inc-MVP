import React, { useState } from 'react';
import { UploadCloud, FileText, Database } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function CreateReport({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', clientId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', keyData: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title: form.title, 
          client_id: form.clientId, 
          ai_context: form.keyData, 
          file_name: fileName || "documento.pdf" 
        })
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error guardando reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow border border-slate-100">
      <h1 className="text-2xl font-bold mb-2 text-slate-800">Nuevo Informe Estratégico</h1>
      <p className="text-slate-500 mb-6">Asigne un documento y datos clave a un cliente.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer relative transition-colors">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setFileName(e.target.files[0].name)} />
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-2 rounded">
              <FileText/> {fileName}
            </div>
          ) : (
            <div className="text-slate-500">
              <UploadCloud className="mx-auto mb-3 h-10 w-10 text-slate-400"/>
              <span className="font-medium text-slate-700">Arrastra archivo PDF aquí</span>
              <p className="text-xs mt-1">o haz clic para buscar</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input placeholder="Ej: Reporte Mensual Cobre" className="border p-2 rounded w-full outline-none focus:ring-2 ring-blue-900" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <select className="border p-2 rounded w-full bg-white outline-none focus:ring-2 ring-blue-900" onChange={e => setForm({...form, clientId: e.target.value})}>
              <option value="b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22">Agrícola del Sur</option>
              <option value="c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33">Minera Norte SpA</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded border border-blue-100">
          <div className="flex gap-2 mb-2 font-semibold text-blue-800 items-center">
            <Database size={18}/> Contexto para IA
          </div>
          <p className="text-xs text-blue-600 mb-2">Estos datos se usarán para generar el resumen automático.</p>
          <textarea 
            className="w-full p-3 border rounded h-24 text-sm focus:ring-2 ring-blue-900 outline-none" 
            placeholder="Ej: Aumento del 5% en volumen exportado. Caída de precios en mercado asiático..." 
            value={form.keyData} 
            onChange={e => setForm({...form, keyData: e.target.value})} 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} type="button">Cancelar</Button>
          <Button type="submit" disabled={loading || !fileName}>
            {loading ? 'Guardando...' : 'Guardar y Asignar'}
          </Button>
        </div>
      </form>
    </div>
  );
}