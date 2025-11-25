// frontend/src/pages/ContactPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header igual al del Home */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-900 font-medium transition-colors">
            <ArrowLeft size={20} /> Volver al Inicio
          </Link>
          <img src="/logoaltiva.png" alt="Altiva" className="h-8 object-contain" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contáctenos</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Complete el formulario y nos pondremos en contacto a la brevedad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Lateral */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-l-4 border-l-blue-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-blue-600" /> Oficinas
                </h3>
                <p className="text-slate-600">Santiago, Chile</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-900 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="text-blue-600" /> Email
                </h3>
                <p className="text-slate-600">contacto@altivainc.cl</p>
              </CardContent>
            </Card>
          </div>

          {/* Formulario (No funcional realmente) */}
          <Card className="md:col-span-2 shadow-xl border-t-4 border-t-blue-900">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado correctamente (Simulación)'); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label><input required className="w-full p-3 border border-slate-300 rounded-lg outline-none" placeholder="Su nombre" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input required type="email" className="w-full p-3 border border-slate-300 rounded-lg outline-none" placeholder="su@email.com" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label><textarea required rows={4} className="w-full p-3 border border-slate-300 rounded-lg outline-none" placeholder="Escriba su consulta..."></textarea></div>
                <div className="flex justify-end"><Button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-lg flex items-center gap-2">Enviar Mensaje <Send size={18} /></Button></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}