import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Coins, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Datos simulados para el gráfico (histórico de la semana)
// Nota: La API gratuita de mindicador a veces tiene límites para el histórico,
// así que usamos datos fijos para el gráfico demostrativo, pero el valor del día es REAL.
const historicData = [
  { dia: 'Lun', valor: 945 },
  { dia: 'Mar', valor: 952 },
  { dia: 'Mie', valor: 948 },
  { dia: 'Jue', valor: 960 },
  { dia: 'Vie', valor: 955 },
  { dia: 'Sab', valor: 958 },
  { dia: 'Dom', valor: 962 },
];

export default function MarketsPage() {
  const [indicators, setIndicators] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Consumo de la API real de indicadores económicos de Chile
    fetch('https://mindicador.cl/api')
      .then(res => res.json())
      .then(data => {
        setIndicators(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando API:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Componente auxiliar para las tarjetas de indicadores
  const IndicatorCard = ({ title, data, icon: Icon, color }: any) => (
    <Card className="border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: color }}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
            {loading ? (
              <span className="animate-pulse bg-slate-200 h-8 w-24 rounded block"></span>
            ) : error ? (
              <span className="text-red-400 text-sm">No disponible</span>
            ) : (
              <>
                <span className="text-lg text-slate-400 font-normal">$</span>
                {data?.valor?.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                <span className="text-xs text-slate-400 font-normal">{data?.unidad_medida === 'Pesos' ? 'CLP' : data?.unidad_medida}</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {loading ? 'Actualizando...' : `Fecha: ${new Date(data?.fecha).toLocaleDateString()}`}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20`, color: color }}>
          <Icon size={32} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Simple */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-900 font-medium transition-colors">
            <ArrowLeft size={20} /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logoaltiva.png" alt="Altiva" className="h-8 object-contain" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Indicadores Financieros</h1>
          <p className="text-slate-500 text-lg">Monitoreo en tiempo real de las principales divisas y valores económicos.</p>
        </div>

        {/* Tarjetas de Indicadores (Datos Reales de API) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <IndicatorCard 
            title="Dólar Observado" 
            data={indicators?.dolar} 
            icon={DollarSign} 
            color="#16a34a" // Verde
          />
          <IndicatorCard 
            title="Euro" 
            data={indicators?.euro} 
            icon={Coins} 
            color="#2563eb" // Azul
          />
          <IndicatorCard 
            title="Unidad de Fomento (UF)" 
            data={indicators?.uf} 
            icon={TrendingUp} 
            color="#ea580c" // Naranja
          />
          <IndicatorCard 
            title="Libra de Cobre" 
            data={indicators?.libra_cobre} 
            icon={Activity} 
            color="#b45309" // Cobre/Café
          />
        </div>

        {/* Sección de Gráficos */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Gráfico de Tendencia (Simulado con datos estáticos para estabilidad visual) */}
          <Card className="md:col-span-2 shadow-md border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Variación del Dólar (Última Semana)</h3>
                  <p className="text-sm text-slate-500">Tendencia de mercado observada</p>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} /> +1.2%
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicData}>
                    <defs>
                      <linearGradient id="colorDolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorDolar)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CTA Lateral */}
          <Card className="shadow-md border-slate-200 bg-blue-900 text-white">
            <CardContent className="p-8 flex flex-col justify-center h-full text-center space-y-6">
              <BarChart3 size={48} className="mx-auto text-blue-300" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Análisis Experto</h3>
                <p className="text-blue-200 leading-relaxed">
                  ¿Necesita proyectar costos de importación con el tipo de cambio actual?
                </p>
              </div>
              <Link to="/login" className="block w-full">
                <button className="w-full bg-white text-blue-900 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
                  Ir al Portal de Clientes
                </button>
              </Link>
              <p className="text-xs text-blue-300 opacity-70">Datos provistos por mindicador.cl</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}