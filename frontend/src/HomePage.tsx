import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, MapPin, Mail, Phone, Send, Database, FileText, ChartNoAxesColumnIncreasing, CalendarDays, FileSearch } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { useLanguage } from './useLanguage';

const services = [
  { icon: Database, color: 'blue', title: 'serv_1_title', desc: 'serv_1_desc' },
  { icon: FileText, color: 'green', title: 'serv_2_title', desc: 'serv_2_desc' },
  { icon: ChartNoAxesColumnIncreasing, color: 'amber', title: 'serv_3_title', desc: 'serv_3_desc' },
  { icon: CalendarDays, color: 'violet', title: 'serv_4_title', desc: 'serv_4_desc' },
  { icon: FileSearch, color: 'cyan', title: 'serv_5_title', desc: 'serv_5_desc' },
];

const serviceColor: Record<string, string> = {
  blue: 'border-blue-500/70 bg-blue-600/30 text-blue-200', green: 'border-emerald-500/70 bg-emerald-600/30 text-emerald-200',
  amber: 'border-amber-500/70 bg-amber-500/30 text-amber-200', violet: 'border-violet-500/70 bg-violet-600/30 text-violet-200',
  cyan: 'border-cyan-500/70 bg-cyan-600/30 text-cyan-200',
};

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Contact request failed');
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="bg-[#00182a] text-white">
      <section id="inicio" className="relative min-h-svh overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/altiva-portada-bg.png')" }}>
        <div className="absolute inset-0 bg-[#00182a]/15" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-b from-transparent via-[#00182a]/70 to-[#00182a]" />
        <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col items-center px-6 pt-24 text-center md:pt-24">
          <h1 className="max-w-4xl text-3xl font-bold leading-tight drop-shadow-lg md:text-4xl lg:text-[42px]">{t('hero_title')}</h1>
          <p className="mt-3 max-w-3xl text-lg text-cyan-300 drop-shadow md:text-xl">{t('hero_subtitle')}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/95 drop-shadow md:text-base">{t('hero_desc')}</p>
          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <button onClick={() => scrollTo('contacto')} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-500">{t('hero_cta')} <ArrowRight size={18} /></button>
            <button onClick={() => scrollTo('servicios')} className="rounded-md border border-white/70 bg-[#00182a]/40 px-7 py-3 font-medium text-white transition hover:bg-white/10">{t('hero_cta_sec')}</button>
          </div>
        </div>
      </section>

      <section id="informes" className="relative min-h-svh overflow-hidden bg-cover bg-top px-5 pb-10 pt-[85px] md:px-8" style={{ backgroundImage: "url('/altiva-informes-bg.png')" }}>
        <div className="absolute inset-0 bg-[#00182a]/20" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-[#00182a] via-[#00182a]/70 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-b from-transparent via-[#00182a]/70 to-[#00182a]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">{t('graphs_title')}</h2>
            <p className="mt-2 text-lg text-cyan-300">{t('graphs_subtitle')}</p>
          </div>
          <div className="h-[582px]" aria-hidden="true" />

          <div id="servicios" className="scroll-mt-24">
            <div className="mb-[58px] text-center">
              <h2 className="text-3xl font-bold md:text-4xl">{t('serv_title')}</h2>
              <p className="mt-1 text-lg text-cyan-300">{t('serv_subtitle')}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              {services.map(({ icon: Icon, color, title, desc }, index) => (
                <article key={title} className={`flex gap-4 rounded-lg border border-sky-700/70 bg-[#001d32]/90 p-4 shadow-lg xl:col-span-2 ${index === 3 ? 'xl:col-start-2' : ''}`}>
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${serviceColor[color]}`}><Icon size={28} strokeWidth={1.7} /></div>
                  <div><h3 className="mb-1 font-semibold leading-snug">{t(title as never)}</h3><p className="text-sm leading-relaxed text-slate-200">{t(desc as never)}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="relative flex min-h-svh flex-col overflow-hidden bg-cover bg-top px-5 pb-0 pt-[110px] md:px-8" style={{ backgroundImage: "url('/altiva-contacto-bg.png')" }}>
        <div className="absolute inset-0 bg-[#00182a]/15" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-[#00182a] via-[#00182a]/70 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{t('contact_title')}</h2>
            <p className="mt-1 text-lg text-cyan-300 md:text-xl">{t('contact_subtitle')}</p>
            <p className="mt-1 text-base text-slate-100 md:text-lg">{lang === 'es' ? 'Podemos conversar por teléfono, WhatsApp o Zoom.' : 'We can talk by phone, WhatsApp, or Zoom.'}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr]">
            <Card className="border border-sky-600/80 bg-[#001d32]/85 text-white shadow-xl">
              <CardContent className="p-6 md:p-7">
                <h3 className="max-w-sm text-2xl font-bold leading-tight md:text-3xl">{t('contact_info_title')}</h3>
                <div className="my-4 h-1 w-16 bg-cyan-400" />
                <p className="mb-5 text-base leading-relaxed text-slate-100">{t('contact_info_desc')}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600"><MapPin size={24} /></span><p><strong className="block">{t('contact_offices')}</strong>{t('contact_city')}</p></div>
                  <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600"><Mail size={24} /></span><p><strong className="block">{t('contact_email')}</strong><a href="mailto:contacto@altivainc.cl" className="hover:text-cyan-300">contacto@altivainc.cl</a></p></div>
                  <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600"><Phone size={24} /></span><p><strong className="block">{t('contact_phone')}</strong><a href="tel:+56996989965" className="hover:text-cyan-300">{t('contact_phone_value')}</a></p></div>
                </div>
                <p className="mt-4 border-t border-sky-700 pt-3 text-slate-100">{t('contact_meeting_note')}</p>
              </CardContent>
            </Card>

            <Card className="border border-sky-600/80 bg-[#001d32]/85 text-white shadow-xl">
              <CardContent className="p-6 md:p-7">
                <h3 className="mb-4 text-2xl font-bold">{t('contact_form_title')}</h3>
                {status === 'success' ? <div className="py-12 text-center"><Send size={36} className="mx-auto mb-4 text-cyan-300" /><h4 className="text-2xl font-bold">{t('contact_success_title')}</h4><p className="mt-2 text-slate-200">{t('contact_success_subtitle')}</p><Button onClick={() => setStatus('idle')} className="mt-6 bg-blue-600">{t('contact_btn_another')}</Button></div> : (
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm">{t('contact_form_name')} *<input required className="mt-1 w-full rounded-md border border-sky-600 bg-[#00182a]/80 p-2.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={t('contact_form_name_placeholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></label>
                      <label className="text-sm">{t('contact_form_email')} *<input required type="email" className="mt-1 w-full rounded-md border border-sky-600 bg-[#00182a]/80 p-2.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={t('contact_form_email_placeholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></label>
                      <label className="text-sm">{t('contact_form_subject')}<input className="mt-1 w-full rounded-md border border-sky-600 bg-[#00182a]/80 p-2.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={t('contact_form_subject_placeholder')} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} /></label>
                      <label className="text-sm">{t('contact_form_phone')}<input type="tel" className="mt-1 w-full rounded-md border border-sky-600 bg-[#00182a]/80 p-2.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={t('contact_form_phone_placeholder')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></label>
                    </div>
                    <label className="block text-sm">{t('contact_form_message')}<textarea required rows={3} className="mt-1 w-full rounded-md border border-sky-600 bg-[#00182a]/80 p-2.5 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={t('contact_form_message_placeholder')} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} /></label>
                    {status === 'error' && <p className="text-sm text-red-300">{t('contact_error')}</p>}
                    <button type="submit" disabled={status === 'loading'} className="flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-lg font-semibold transition hover:brightness-110 disabled:opacity-60"><Send size={20} />{status === 'loading' ? t('contact_btn_sending') : t('contact_btn_send')}</button>
                    <p className="text-center text-sm text-slate-200">{t('contact_form_note')}</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <footer className="relative mt-auto w-full px-6 py-6 text-center text-sm text-slate-400">© {new Date().getFullYear()} Altiva Inc. {t('footer_rights')}</footer>
      </section>
    </main>
  );
}
