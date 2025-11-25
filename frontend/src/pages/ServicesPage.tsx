// frontend/src/pages/ServicesPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, FileText, TrendingUp, Globe2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export default function ServicesPage() {
  const services = [
    { icon: BarChart3, title: 'Análisis Estadístico', description: 'Procesamiento profundo de bases de datos aduaneras.' },
    { icon: FileText, title: 'Informes Personalizados', description: 'Reportes diseñados a la medida de su gerencia.' },
    { icon: TrendingUp, title: 'Visualización de Datos', description: 'Dashboards interactivos para la toma de decisiones.' },
    { icon: Globe2, title: 'Monitoreo Continuo', description: 'Vigilancia estratégica de su competencia.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-900 font-medium transition-colors">
            <ArrowLeft size={20} /> Volver al Inicio
          </Link>
          <img src="/logoaltiva.png" alt="Altiva" className="h-8 object-contain" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Nuestras Soluciones</h1>
          <p className="text-xl text-slate-600">Servicios especializados en inteligencia comercial.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-all border-t-4 border-t-blue-900">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="p-4 bg-blue-50 rounded-xl text-blue-700 shrink-0"><service.icon size={32} /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-lg text-slate-600">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}