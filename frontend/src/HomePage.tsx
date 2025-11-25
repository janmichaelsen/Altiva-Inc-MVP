// frontend/src/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { ArrowRight, BarChart3, FileText, TrendingUp, Globe2, Mail, Phone, MapPin } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import type { Language } from './types';

interface HomePageProps {
  language: Language;
  onNavigate: (page: string) => void;
}

const translations = {
  es: {
    hero: {
      title: 'Análisis Estratégico de Comercio Exterior',
      subtitle: 'Transformamos datos de comercio exterior en información estratégica procesada para la toma de decisiones',
      description: 'ALTIVA INC. es una consultora chilena especializada en el análisis de estadísticas de exportaciones e importaciones. Entregamos informes personalizados con datos oficiales depurados y visualizados para empresas exportadoras, importadoras, asociaciones gremiales y consultoras.',
      cta: 'Solicitar Consulta',
      learnMore: 'Conocer Servicios',
    },
    examples: {
      title: 'Ejemplos de Nuestros Análisis',
      subtitle: 'Visualizaciones y reportes que impulsan decisiones estratégicas',
      export: 'Exportaciones por Sector',
      import: 'Tendencia de Importaciones',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones especializadas para cada necesidad',
      statistical: { title: 'Análisis Estadístico', description: 'Procesamiento y análisis profundo de datos de comercio exterior' },
      reports: { title: 'Informes Personalizados', description: 'Reportes adaptados a sus necesidades específicas del sector' },
      visualization: { title: 'Visualización de Datos', description: 'Dashboards interactivos y gráficos estratégicos' },
      monitoring: { title: 'Monitoreo Continuo', description: 'Seguimiento de tendencias y oportunidades de mercado' },
    },
  },
  en: {
    hero: {
      title: 'Strategic Foreign Trade Analysis',
      subtitle: 'We transform foreign trade data into processed strategic information for decision making',
      description: 'ALTIVA INC. is a Chilean consulting firm specialized in the analysis of export and import statistics. We deliver customized reports with cleaned and visualized official data for exporting and importing companies, trade associations, and consulting firms.',
      cta: 'Request Consultation',
      learnMore: 'View Services',
    },
    examples: {
      title: 'Examples of Our Analysis',
      subtitle: 'Visualizations and reports that drive strategic decisions',
      export: 'Exports by Sector',
      import: 'Import Trends',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Specialized solutions for every need',
      statistical: { title: 'Statistical Analysis', description: 'Deep processing and analysis of foreign trade data' },
      reports: { title: 'Custom Reports', description: 'Reports tailored to your specific sector needs' },
      visualization: { title: 'Data Visualization', description: 'Interactive dashboards and strategic charts' },
      monitoring: { title: 'Continuous Monitoring', description: 'Tracking market trends and opportunities' },
    },
  },
};

const exportData = [ { sector: 'Minería', valor: 45000 }, { sector: 'Agricultura', valor: 32000 }, { sector: 'Industria', valor: 28000 }, { sector: 'Servicios', valor: 15000 } ];
const importTrendData = [ { mes: 'Ene', valor: 25000 }, { mes: 'Feb', valor: 28000 }, { mes: 'Mar', valor: 26500 }, { mes: 'Abr', valor: 31000 }, { mes: 'May', valor: 29000 }, { mes: 'Jun', valor: 35000 } ];

export default function HomePage({ language }: HomePageProps) {
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - ORIGINAL */}
      <section className="relative py-20 md:py-32 flex items-center min-h-[600px]">
        {/* FOTO ORIGINAL RESTAURADA */}
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1713127563314-5163b052cf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsJTIwYnVzaW5lc3MlMjB0cmFkZXxlbnwxfHx8fDE3NjMwNzY4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="International Business Trade" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white font-normal">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate('/contact')} className="gap-2 bg-blue-800 hover:bg-blue-900 text-white border-none">
                {t.hero.cta} <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/services')} className="bg-transparent border border-white text-white hover:bg-white/10 hover:text-white">
                {t.hero.learnMore}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Examples Section (GRÁFICOS PRIMERO, como pediste) */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-slate-900">{t.examples.title}</h2>
            <p className="text-xl text-slate-500">{t.examples.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="mb-6 text-center text-lg font-medium">{t.examples.export}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#1e3a8a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="mb-6 text-center text-lg font-medium">{t.examples.import}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={importTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valor" stroke="#ea580c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. Services Section (SERVICIOS DESPUÉS) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-slate-900">{t.services.title}</h2>
            <p className="text-xl text-slate-500">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[{ icon: BarChart3, ...t.services.statistical }, { icon: FileText, ...t.services.reports }, { icon: TrendingUp, ...t.services.visualization }, { icon: Globe2, ...t.services.monitoring }].map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow bg-white border-slate-200">
                <CardContent className="pt-8 pb-8 px-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-blue-50 rounded-lg flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/services')} className="bg-blue-800 hover:bg-blue-900 text-white px-8">
              {t.hero.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. FOOTER (NUEVO - COMO EN LA FOTO) */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Columna 1: Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logoaltiva.png" alt="Altiva Inc" className="h-8 object-contain" />
                <span className="font-bold text-xl text-blue-900 tracking-tighter">ALTIVA INC.</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Análisis estratégico de comercio exterior para empresas que buscan decisiones basadas en datos depurados.
              </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><a href="/" className="hover:text-blue-900">Inicio</a></li>
                <li><a href="/services" className="hover:text-blue-900">Servicios</a></li>
                <li><a href="/contact" className="hover:text-blue-900">Contacto</a></li>
                <li><a href="/login" className="hover:text-blue-900">Portal Clientes</a></li>
              </ul>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Información de Contacto</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-900 shrink-0" />
                  <span>Santiago, Chile</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-900 shrink-0" />
                  <span>contacto@altivainc.cl</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-900 shrink-0" />
                  <span>+56 2 2XXX XXXX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
            © 2025 Altiva Inc. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}