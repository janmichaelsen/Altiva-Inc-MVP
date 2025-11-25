import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Building, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mantenemos 'company_rut' internamente para compatibilidad con la BD, 
  // pero guardaremos el nombre ahí.
  const [form, setForm] = useState({ name: '', email: '', password: '', company_rut: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');

      alert('Cuenta creada exitosamente. Ahora puede iniciar sesión.');
      navigate('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-blue-900 flex items-center gap-2 transition-colors font-medium">
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-900">
        <CardContent className="pt-8 px-8 pb-8">
          <div className="text-center mb-8">
            <img src="/logoaltiva.png" alt="Altiva Logo" className="h-12 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crear Cuenta</h1>
            <p className="text-slate-500 mt-2">Únase a Altiva Inc. para gestionar sus informes</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="text" placeholder="Juan Pérez" className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 transition-all"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            </div>

            {/* CAMBIO AQUÍ: AHORA PIDE NOMBRE DE EMPRESA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" placeholder="Ej: Agrícola Del Sur SpA" className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 transition-all"
                  value={form.company_rut} onChange={e => setForm({...form, company_rut: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="email" placeholder="nombre@empresa.com" className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 transition-all"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="password" placeholder="Mínimo 6 caracteres" className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 transition-all"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 py-6 text-base" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm mb-3">¿Ya tiene una cuenta?</p>
            <Link to="/login" className="text-blue-800 font-medium hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
