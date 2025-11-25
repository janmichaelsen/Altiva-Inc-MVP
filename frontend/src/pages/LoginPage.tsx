import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
// 1. AGREGADO: Imports de Google
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error de conexión. Revisa el servidor.');
    } finally {
      setLoading(false);
    }
  };

// iniciar con google
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // 1. Decodificamos la info que nos da Google
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Login Google exitoso:", decoded);
      
      // 2. [EL CAMBIO CLAVE] Avisamos al Backend para que lo guarde en database.json
      await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: decoded.email,   // Guardamos el correo
            name: decoded.name,     // Guardamos el nombre
            picture: decoded.picture
        })
      });

      // 3. Guardamos en el navegador para que la página funcione
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: 'client'
      };

      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // 4. Entramos
      navigate('/dashboard');
      window.location.reload(); 
    } catch (error) {
      console.error("Error Google", error);
      setError('Error al sincronizar con Google.');
    }
  };;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-blue-900 flex items-center gap-2 transition-colors font-medium">
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-900">
        <CardContent className="pt-8 px-8 pb-8">
          <div className="text-center mb-8">
            <img src="/logoaltiva.png" alt="Altiva Logo" className="h-16 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portal de Clientes</h1>
            <p className="text-slate-500 mt-2">Ingrese sus credenciales para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="nombre@empresa.com" 
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                <a href="#" className="text-xs text-blue-700 hover:underline">¿Olvidó su contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 py-6 text-base" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* 3. AGREGADO: Separador visual */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">O ingresa con</span>
            </div>
          </div>

          {/* 4. AGREGADO: Botón de Google */}
          <div className="flex justify-center w-full">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Login fallido')}
                useOneTap
                theme="outline"
                size="large"
                width="350"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm mb-3">¿Aún no es cliente?</p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 w-full py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <UserPlus size={18} />
              Crear una cuenta
            </Link>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded text-xs text-slate-400 text-center border border-slate-100">
            <span className="font-semibold">Acceso Demo:</span> admin@altiva.cl / cliente1@agricola.cl (Pass: 123456)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
