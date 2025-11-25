import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe2, ShieldCheck, FileText, TrendingUp, MapPin, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from './useLanguage';

// Datos para los gráficos
const sectorData = [
  { name: 'Minería', Exportaciones: 45000 },
  { name: 'Agro', Exportaciones: 32000 },
  { name: 'Ind.', Exportaciones: 28000 },
  { name: 'Serv.', Exportaciones: 15000 },
];

const importData = [
  { name: 'Ene', valor: 25000 },
  { name: 'Feb', valor: 27000 },
  { name: 'Mar', valor: 26000 },
  { name: 'Abr', valor: 30000 },
  { name: 'May', valor: 28500 },
  { name: 'Jun', valor: 36000 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559297434-fae8a1916a79?q=80&w=2070&auto=format&fit=crop" 
            alt="Barco de carga" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        <div className="relative z-10 text-white p-6 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-xl">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl font-light drop-shadow-md">
            {t('hero_subtitle')}
          </p>
          <div className="text-sm md:text-base opacity-90 mb-12 max-w-2xl bg-black/40 p-6 rounded-xl backdrop-blur-sm border border-white/10">
             {t('hero_desc')}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={() => navigate('/contact')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              {t('hero_cta')} <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/services')} className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-xl">
              {t('hero_cta_sec')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN GRÁFICOS */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('graphs_title')}</h2>
            <p className="text-lg text-slate-600">{t('graphs_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-lg border-t-4 border-t-blue-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                  <BarChart3 className="text-blue-600"/> Exportaciones por Sector
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border:'none'}} />
                      <Bar dataKey="Exportaciones" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-t-4 border-t-blue-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                   <BarChart3 className="text-blue-600"/> Tendencia Importaciones
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={importData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                      <Tooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                      <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={3} dot={{r:4, fill:'#2563eb'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE SERVICIOS */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('serv_title')}</h2>
            <p className="text-xl text-slate-500">{t('serv_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Tarjeta 1 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl transition-shadow text-center group">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t('serv_1_title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('serv_1_desc')}</p>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl transition-shadow text-center group">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t('serv_2_title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('serv_2_desc')}</p>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl transition-shadow text-center group">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t('serv_3_title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('serv_3_desc')}</p>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl transition-shadow text-center group">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t('serv_4_title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t('serv_4_desc')}</p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/services')}
              className="bg-blue-800 text-white font-semibold py-3 px-10 rounded-lg hover:bg-blue-900 transition-colors shadow-md inline-flex items-center gap-2"
            >
              {t('hero_cta_sec')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Columna Logo */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                 <img src="/logoaltiva.png" alt="Altiva Inc" className="h-10 object-contain" />
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                {t('footer_desc')}
              </p>
            </div>

            {/* Columna Enlaces */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">{t('footer_links')}</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-blue-700 transition-colors">{t('nav_home')}</Link></li>
                <li><Link to="/services" className="hover:text-blue-700 transition-colors">{t('nav_services')}</Link></li>
                <li><Link to="/contact" className="hover:text-blue-700 transition-colors">{t('nav_contact')}</Link></li>
                <li><Link to="/login" className="hover:text-blue-700 transition-colors">{t('nav_login')}</Link></li>
              </ul>
            </div>

            {/* Columna Contacto */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">{t('footer_contact')}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Santiago, Chile</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400 shrink-0" />
                  <a href="mailto:contacto@altivainc.cl" className="hover:text-blue-700 transition-colors">contacto@altivainc.cl</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400 shrink-0" />
                  <span>+56 2 2XXX XXXX</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Altiva Inc. {t('footer_rights')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}