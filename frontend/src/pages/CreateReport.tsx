import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Edit, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../useLanguage';

// Fíjate que aquí ya no hay ({ onCancel, onSuccess })
export default function AdminDashboard() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', clientId: '', keyData: '' });
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const resC = await fetch('http://localhost:3000/api/users/clients', { headers });
      const clientsData = await resC.json();
      setClients(clientsData);
      if (clientsData.length > 0 && !form.clientId) setForm(prev => ({...prev, clientId: clientsData[0].id}));

      const resR = await fetch('http://localhost:3000/api/reports', { headers });
      setReports(await resR.json());
    };
    fetchData();
  }, [reload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = editingId ? `http://localhost:3000/api/reports/${editingId}` : 'http://localhost:3000/api/reports';
    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title: form.title, 
          client_id: form.clientId, 
          ai_context: form.keyData, 
          file_name: fileName || "doc.pdf" 
        })
      });
      setEditingId(null);
      setForm({ title: '', clientId: clients[0]?.id || '', keyData: '' });
      setFileName(null);
      setReload(!reload);
      alert("Operación exitosa");
    } catch (error) { alert("Error"); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar reporte?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3000/api/reports/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    setReload(!reload);
  };

  const startEdit = (report: any) => {
    setEditingId(report.id);
    setForm({ title: report.title, clientId: report.client_id, keyData: report.ai_context || '' });
    window.scrollTo(0,0);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow border border-slate-100">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? t('admin_edit') : t('admin_create')}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-12 border-b pb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Título</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded w-full" required/></div>
          <div><label className="block text-sm font-medium mb-1">Cliente</label><select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} className="border p-2 rounded w-full">{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        </div>
        <div className="bg-blue-50 p-4 rounded"><label className="block text-sm font-semibold text-blue-800 mb-2">Contexto IA</label><textarea value={form.keyData} onChange={e => setForm({...form, keyData: e.target.value})} className="w-full p-2 border rounded h-20" placeholder="Datos clave..."/></div>
        
        {!editingId && (
           <div className="border-2 border-dashed border-slate-300 p-4 text-center rounded relative cursor-pointer hover:bg-slate-50">
             <input type="file" className="absolute inset-0 opacity-0" onChange={(e) => e.target.files && setFileName(e.target.files[0].name)} />
             <div className="text-slate-500 flex flex-col items-center"><UploadCloud className="mb-2"/> {fileName || "Arrastra PDF aquí"}</div>
           </div>
        )}

        <div className="flex gap-2 justify-end">
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({...form, title:'', keyData:''}); }}>{t('btn_cancel')}</Button>}
          <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : t('btn_save')}</Button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4 text-slate-700">Reportes Activos</h2>
      <div className="space-y-3">
        {reports.map(report => (
          <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" />
              <div><p className="font-semibold text-slate-800">{report.title}</p><p className="text-xs text-slate-500">Cliente: {report.users?.name}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(report)} className="p-2 text-blue-600 hover:bg-blue-100 rounded" title={t('btn_edit')}><Edit size={18} /></button>
              <button onClick={() => handleDelete(report.id)} className="p-2 text-red-600 hover:bg-red-100 rounded" title={t('btn_delete')}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}