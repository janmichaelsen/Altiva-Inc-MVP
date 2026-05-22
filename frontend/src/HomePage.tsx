import React, { useState } from 'react';
import { ArrowRight, MapPin, Mail, Phone, Send, BarChart3, FileText, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from './useLanguage';

// Datos para los gráficos
const sectorData = [
  { name: 'Minería', Exportaciones: 45000 },
  { name: 'Agricultura', Exportaciones: 32000 },
  { name: 'Industria', Exportaciones: 28000 },
  { name: 'Servicios', Exportaciones: 15000 },
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
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const translatedSectorData = sectorData.map(item => {
    let key = '';
    if (item.name === 'Minería') key = 'sector_mineria';
    else if (item.name === 'Agricultura') key = 'sector_agricultura';
    else if (item.name === 'Industria') key = 'sector_industria';
    else if (item.name === 'Servicios') key = 'sector_servicios';
    return {
      ...item,
      name: key ? t(key as any) : item.name
    };
  });

  const translatedImportData = importData.map(item => {
    let key = '';
    if (item.name === 'Ene') key = 'month_ene';
    else if (item.name === 'Feb') key = 'month_feb';
    else if (item.name === 'Mar') key = 'month_mar';
    else if (item.name === 'Abr') key = 'month_abr';
    else if (item.name === 'May') key = 'month_may';
    else if (item.name === 'Jun') key = 'month_jun';
    return {
      ...item,
      name: key ? t(key as any) : item.name
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/cargo-ship.jpg" 
            alt="Barco de carga" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-white p-6 max-w-5xl mx-auto flex flex-col items-center mt-10">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 leading-tight">
            {t('hero_title')}
          </h1>
          
          <p className="text-lg md:text-xl opacity-100 font-light text-[#a8d5e2] mb-6 mt-4">
            {t('hero_subtitle')}
          </p>

          <div className="text-sm md:text-[15px] opacity-90 mb-12 max-w-3xl leading-relaxed text-[#f8f9fa]">
             {t('hero_desc')}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
            <button onClick={scrollToContact} className="bg-[#1e3a8a] hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2">
              {t('hero_cta')} <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="bg-transparent border border-white text-white font-medium py-3 px-8 rounded-md hover:bg-white/10 transition-colors"
            >
              {t('hero_cta_sec')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN GRÁFICOS */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('graphs_title')}</h2>
            <p className="text-lg text-slate-600">{t('graphs_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-none border border-slate-200 rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-base font-medium mb-8 text-slate-800 text-center">
                  {t('graphs_sector')}
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={translatedSectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" fontSize={13} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} dy={10} />
                      <YAxis fontSize={13} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} tick={{fill: '#64748b'}} dx={-10} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="Exportaciones" name={t('graph_value_exportations')} fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-none border border-slate-200 rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-base font-medium mb-8 text-slate-800 text-center">
                  {t('graphs_imports')}
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <LineChart data={translatedImportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" fontSize={13} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} dy={10} />
                      <YAxis fontSize={13} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} tick={{fill: '#64748b'}} dx={-10} />
                      <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="valor" name={t('graph_value_import')} stroke="#3b82f6" strokeWidth={2} dot={{r:4, fill:'#fff', stroke: '#3b82f6', strokeWidth: 2}} activeDot={{r:6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE SERVICIOS */}
      <section id="servicios" className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-[34px] font-semibold text-slate-900 mb-3">{t('serv_title')}</h2>
            <p className="text-base text-slate-500 font-light">{t('serv_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(30,58,138,0.06)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50/80 text-[#1e3a8a] rounded-xl flex items-center justify-center mb-5">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">{t('serv_1_title')}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-light">{t('serv_1_desc')}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(30,58,138,0.06)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50/80 text-[#1e3a8a] rounded-xl flex items-center justify-center mb-5">
                <FileText size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">{t('serv_2_title')}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-light">{t('serv_2_desc')}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(30,58,138,0.06)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50/80 text-[#1e3a8a] rounded-xl flex items-center justify-center mb-5">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">{t('serv_3_title')}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-light">{t('serv_3_desc')}</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(30,58,138,0.06)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50/80 text-[#1e3a8a] rounded-xl flex items-center justify-center mb-5">
                <Globe size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">{t('serv_4_title')}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-light">{t('serv_4_desc')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN CONTACTO */}
      <section id="contacto" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('contact_title')}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('contact_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Info Lateral */}
            <div className="md:col-span-1 space-y-6">
              <Card className="border-l-4 border-l-blue-900 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="text-blue-600" /> {t('contact_offices')}
                  </h3>
                  <p className="text-slate-600">{t('contact_city')}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-900 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <Mail className="text-blue-600" /> {t('contact_email')}
                  </h3>
                  <p className="text-slate-600">contacto@altivainc.cl</p>
                </CardContent>
              </Card>
            </div>

            {/* Formulario Funcional */}
            <Card className="md:col-span-2 shadow-xl border-t-4 border-t-blue-900">
              <CardContent className="p-8">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('contact_success_title')}</h3>
                    <p className="text-slate-600">{t('contact_success_subtitle')}</p>
                    <Button onClick={() => setStatus('idle')} className="mt-6 bg-blue-900">{t('contact_btn_another')}</Button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact_form_name')}</label>
                        <input
                          required
                          className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                          placeholder={t('contact_form_name_placeholder')}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact_form_email')}</label>
                        <input
                          required
                          type="email"
                          className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                          placeholder={t('contact_form_email_placeholder')}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact_form_subject')}</label>
                      <input
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                        placeholder={t('contact_form_subject_placeholder')}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact_form_message')}</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                        placeholder={t('contact_form_message_placeholder')}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>
                    {status === 'error' && (
                      <p className="text-red-500 text-sm">{t('contact_error')}</p>
                    )}
                    <div className="flex justify-end">
                      <Button type="submit" disabled={status === 'loading'} className="bg-blue-900 text-white px-8 py-3 rounded-lg flex items-center gap-2">
                        {status === 'loading' ? t('contact_btn_sending') : t('contact_btn_send')} <Send size={18} />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Columna Logo */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logoaltiva.png" alt="Altiva Inc" className="h-10 object-contain" />
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                {t('footer_desc')}
              </p>
            </div>

            {/* Columna Contacto */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">{t('footer_contact')}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{t('contact_city')}</span>
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