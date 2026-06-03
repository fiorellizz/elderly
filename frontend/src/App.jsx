import React, { useState, useEffect } from 'react';
import { 
  Pill, AlertCircle, History, LogOut, CheckCircle2, 
  ShieldCheck, UserRound, ClipboardCheck, 
  Activity, HeartPulse, Package, CalendarDays, 
  LayoutDashboard, PlusCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // State para alertas de UI (Importante para o Robot Framework ler os textos)
  const [uiMessage, setUiMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setUiMessage({ type, text });
    setTimeout(() => setUiMessage({ type: '', text: '' }), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Injeta a fonte Inter no documento dinamicamente
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  if (!token) {
    return <LoginView setToken={setToken} showMessage={showMessage} uiMessage={uiMessage} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navbar Moderna */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Elderly</h1>
            </div>
            
            <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <NavButton id="navDashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
              <NavButton id="navCadastro" active={currentView === 'cadastro'} onClick={() => setCurrentView('cadastro')} icon={<PlusCircle size={18}/>} label="Cadastrar" />
              <NavButton id="navAuditoria" active={currentView === 'auditoria'} onClick={() => setCurrentView('auditoria')} icon={<ClipboardCheck size={18}/>} label="Auditoria" />
            </div>

            <button id="navLogout" onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
              <LogOut size={18}/> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <AnimatePresence>
          {uiMessage.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              id="mensagemSistema" 
              className={`p-4 mb-6 rounded-xl flex items-center gap-3 shadow-sm border ${
                uiMessage.type === 'erro' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {uiMessage.type === 'erro' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="font-medium">{uiMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {currentView === 'dashboard' && <DashboardView token={token} showMessage={showMessage} />}
        {currentView === 'cadastro' && <CadastroView token={token} showMessage={showMessage} setView={setCurrentView} />}
        {currentView === 'auditoria' && <AuditoriaView token={token} />}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, id }) {
  return (
    <button 
      id={id}
      onClick={onClick} 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ==========================================
// TELA 1: LOGIN MODERNIZADA
// ==========================================
function LoginView({ setToken, showMessage, uiMessage }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        showMessage('erro', data.mensagem || 'Credenciais inválidas');
      }
    } catch (error) {
      showMessage('erro', 'Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Lado Esquerdo - Imagem (Escondido no Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200" 
          alt="Cuidado com a saúde do idoso" 
          className="absolute inset-0 object-cover w-full h-full opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl inline-block mb-6 border border-white/30">
              <HeartPulse className="text-white w-8 h-8" />
            </div>
            <h2 className="text-white text-4xl font-bold mb-4 leading-tight">Gestão inteligente<br/>para quem você ama.</h2>
            <p className="text-blue-100 text-lg max-w-md font-light">O Sistema Elderly garante segurança e organização no controle de medicamentos da sua família.</p>
          </motion.div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-slate-500 mt-2 font-medium">Acesse sua conta para continuar</p>
          </div>
          
          <AnimatePresence>
            {uiMessage.text && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                id="mensagemErro" className="bg-red-50 text-red-600 border border-red-100 p-4 mb-6 text-sm font-medium rounded-xl flex items-center gap-2">
                <AlertCircle size={18} /> {uiMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail de Acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserRound size={18} />
                </div>
                <input 
                  id="email" type="email" placeholder="ana@elderly.com" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <input 
                  id="senha" type="password" placeholder="••••••" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                  value={senha} onChange={e => setSenha(e.target.value)}
                />
              </div>
            </div>

            <button id="btnLogin" type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-[15px] shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2 flex justify-center items-center gap-2">
              Entrar na Plataforma <ArrowRight size={18}/>
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium bg-slate-50 inline-block px-4 py-2 rounded-lg">Ambiente de Testes: <span className="text-slate-700 font-bold">ana@elderly.com</span> / <span className="text-slate-700 font-bold">123456</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// TELA 2: DASHBOARD (Listagem e Consumo)
// ==========================================
function DashboardView({ token, showMessage }) {
  const [medicamentos, setMedicamentos] = useState([]);

  const fetchMedicamentos = async () => {
    const res = await fetch(`${API_URL}/medicamentos`, { headers: { 'Authorization': `Bearer ${token}` }});
    if (res.ok) setMedicamentos(await res.json());
  };

  useEffect(() => { fetchMedicamentos(); }, []);

  const registrarConsumo = async (id) => {
    const res = await fetch(`${API_URL}/consumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ medicamento_id: id, quantidade_consumida: 1 })
    });
    if (res.ok) {
      showMessage('sucesso', 'Dose registrada com sucesso!');
      fetchMedicamentos();
    }
  };

  // KPIs
  const totalMeds = medicamentos.length;
  const lowStockMeds = medicamentos.filter(m => m.quantidade > 0 && m.quantidade <= 5).length;
  const outOfStockMeds = medicamentos.filter(m => m.quantidade <= 0).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header do Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
        <p className="text-slate-500 font-medium">Acompanhe a situação do estoque e as rotinas de medicação.</p>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Medicamentos Ativos" value={totalMeds} icon={<Pill size={24} className="text-blue-600"/>} bg="bg-blue-50" />
        <KpiCard title="Estoque Baixo" value={lowStockMeds} icon={<AlertCircle size={24} className="text-amber-600"/>} bg="bg-amber-50" />
        <KpiCard title="Sem Estoque" value={outOfStockMeds} icon={<Package size={24} className="text-red-600"/>} bg="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Medicamentos */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Pill size={20}/> Medicamentos Cadastrados</h3>
          {medicamentos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              <Pill size={48} className="mx-auto mb-4 text-slate-300"/>
              <p className="font-medium text-lg">Nenhum medicamento encontrado.</p>
              <p className="text-sm">Vá até a aba "Cadastrar" para iniciar o controle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {medicamentos.map(med => (
                <motion.div key={med.id} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Pill size={24} className="text-blue-500"/>
                      </div>
                      {med.quantidade > 5 ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Normal</span>
                      ) : med.quantidade > 0 ? (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12}/> Baixo</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12}/> Zerado</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{med.nome}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">Dosagem: {med.dosagem}</p>
                    
                    <div className="flex items-center justify-between text-sm font-semibold mb-6">
                      <span className="text-slate-600">Estoque atual:</span>
                      <span className={`text-base ${med.quantidade <= 0 ? 'text-red-600' : 'text-slate-900'}`}>{med.quantidade} un.</span>
                    </div>
                  </div>
                  
                  <button 
                    id={`btnTomar-${med.id}`}
                    onClick={() => registrarConsumo(med.id)}
                    disabled={med.quantidade <= 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={18} /> Registrar Dose
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Gráfico Recharts - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity size={20}/> Níveis de Estoque</h3>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px]">
            {medicamentos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicamentos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{fill: '#F1F5F9'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                    {medicamentos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.quantidade > 5 ? '#3B82F6' : entry.quantidade > 0 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">Sem dados para exibir</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KpiCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
      <div className={`${bg} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ==========================================
// TELA 3: CADASTRO
// ==========================================
function CadastroView({ token, showMessage, setView }) {
  const [form, setForm] = useState({ nome: '', dosagem: '', quantidade: '', data_compra: '', data_validade: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(form.quantidade <= 0) {
        showMessage('erro', 'A quantidade deve ser maior que zero');
        return;
    }
    const res = await fetch(`${API_URL}/medicamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      showMessage('sucesso', 'Medicamento cadastrado!');
      setView('dashboard');
    } else {
      showMessage('erro', data.mensagem || 'Erro ao cadastrar');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><PlusCircle size={28}/></div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cadastrar Medicamento</h2>
            <p className="text-slate-500 font-medium">Insira as informações para iniciar o controle.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Medicamento *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Pill size={18} /></div>
              <input 
                id="nomeMedicamento" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900" 
                placeholder="Ex: Losartana Potássica"
                value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Dosagem *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Activity size={18} /></div>
                <input 
                  id="dosagem" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900" 
                  placeholder="Ex: 50mg"
                  value={form.dosagem} onChange={e => setForm({...form, dosagem: e.target.value})} required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estoque Inicial (unidades) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Package size={18} /></div>
                <input 
                  id="quantidade" type="number" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900" 
                  placeholder="Ex: 30"
                  value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Data da Compra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><CalendarDays size={18} /></div>
                <input 
                  id="dataCompra" type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900 text-slate-600" 
                  value={form.data_compra} onChange={e => setForm({...form, data_compra: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Data de Validade</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><CalendarDays size={18} /></div>
                <input 
                  id="dataValidade" type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900 text-slate-600" 
                  value={form.data_validade} onChange={e => setForm({...form, data_validade: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <button id="btnSalvar" type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg">
              Registrar no Sistema
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// ==========================================
// TELA 4: AUDITORIA
// ==========================================
function AuditoriaView({ token }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      const res = await fetch(`${API_URL}/admin/auditoria`, { headers: { 'Authorization': `Bearer ${token}` }});
      if (res.ok) setHistorico(await res.json());
    };
    fetchAuditoria();
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"><History className="text-blue-600" /> Log de Auditoria</h2>
          <p className="text-slate-500 font-medium mt-1">Histórico imutável de todas as doses registradas no sistema.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
          <Activity size={16}/> {historico.length} registros auditados
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data do Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Medicamento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Movimentação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historico.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium">Nenhum evento registrado no histórico.</td>
                </tr>
              )}
              {historico.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    {new Date(log.data_consumo).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Pill size={16}/></div>
                      <span className="font-bold text-slate-900">{log.medicamento}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-600 border border-red-100">
                      <ArrowRight size={14} className="rotate-45" /> -{log.quantidade_consumida} dose
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}