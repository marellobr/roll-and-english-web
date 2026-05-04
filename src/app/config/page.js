'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/services/api';

const BADGES = [
  { nome: 'Faixa Branca', min: 0, cor: '#FFFFFF' },
  { nome: 'Faixa Azul', min: 50, cor: '#2D6BE4' },
  { nome: 'Faixa Roxa', min: 150, cor: '#8B5CF6' },
  { nome: 'Faixa Marrom', min: 300, cor: '#92400E' },
  { nome: 'Faixa Preta', min: 500, cor: '#CCCCCC' },
];

function getBadge(pontos) {
  let badge = BADGES[0];
  for (const b of BADGES) { if (pontos >= b.min) badge = b; }
  return badge;
}

export default function ConfigPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dados, setDados] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    userAPI.getMe().then(r => {
      setDados(r.data);
      setWhatsapp(r.data?.user?.whatsapp || '');
    }).catch(console.error);
  }, [user]);

  async function salvarWhatsApp() {
    setSalvando(true);
    try {
      await userAPI.atualizarWhatsApp(whatsapp.replace(/\D/g, ''));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch { } finally { setSalvando(false); }
  }

  function handleLogout() {
    if (confirm('Tem certeza? Seu progresso está salvo!')) {
      logout();
      router.push('/login');
    }
  }

  const pontos = dados?.user?.pontos_totais || 0;
  const badge = getBadge(pontos);

  return (
    <div className="min-h-screen bg-[#080808] pb-16">
      <div className="max-w-2xl mx-auto px-5 pt-14">

        <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest mb-6">
          ← DASHBOARD
        </button>

        <h1 className="text-white text-2xl font-bold tracking-widest mb-1">CONFIG</h1>
        <div className="w-10 h-0.5 bg-red-600 mb-6" />

        {/* Perfil */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-600/10 border-2 border-red-600/40 flex items-center justify-center">
            <span className="text-red-600 text-xl font-bold">
              {user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'JJ'}
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-base">{dados?.user?.nome || user?.nome}</p>
            <p className="text-[#555] text-sm">{dados?.user?.email || user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-4 flex items-center">
          {[
            { label: 'FAIXA', val: badge.nome.split(' ')[1], cor: badge.cor },
            { label: 'STREAK', val: dados?.user?.streak_atual || 0, cor: '#E63946' },
            { label: 'PONTOS', val: pontos, cor: '#FFF' },
            { label: 'PALAVRAS', val: dados?.user?.palavras_aprendidas || 0, cor: '#FFF' },
          ].map((s, i, arr) => (
            <div key={i} className="flex-1 text-center">
              <p className="font-bold text-sm" style={{ color: s.cor }}>{s.val}</p>
              <p className="text-[#444] text-[8px] tracking-widest mt-0.5">{s.label}</p>
              {i < arr.length - 1 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-[#222]" />}
            </div>
          ))}
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">WHATSAPP</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4">
          <div className="bg-[#0A0A0A] rounded-xl p-3 mb-4 flex flex-col gap-2">
            {[
              { cor: '#E63946', txt: '7h — Missão do dia' },
              { cor: '#F4A261', txt: '12h — Quiz rápido' },
              { cor: '#2ECC71', txt: '20h — Revisão + motivação' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.cor }} />
                <p className="text-[#888] text-sm">{item.txt}</p>
              </div>
            ))}
          </div>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
            className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50 mb-2"
          />
          <p className="text-[#333] text-xs mb-4">País + DDD + número, sem espaços</p>
          <button onClick={salvarWhatsApp} disabled={salvando}
            className={`w-full py-3 rounded-xl font-bold tracking-widest text-sm transition-all ${salvo ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'} disabled:opacity-50`}>
            {salvo ? '✓ SALVO!' : salvando ? 'SALVANDO...' : 'SALVAR WHATSAPP'}
          </button>
        </div>

        {/* App info */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">APP</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-6">
          {[
            { label: 'VERSÃO', val: '1.0.0' },
            { label: 'AULAS DISPONÍVEIS', val: '45' },
            { label: 'BACKEND', val: 'Railway' },
          ].map((item, i, arr) => (
            <div key={i} className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-[#1A1A1A]' : ''}`}>
              <p className="text-[#555] text-xs tracking-widest">{item.label}</p>
              <p className="text-white text-xs font-bold">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Sair */}
        <button onClick={handleLogout} className="w-full py-3 border border-[#1A1A1A] rounded-xl text-[#333] text-xs font-bold tracking-widest hover:border-[#333] transition-all">
          SAIR DA CONTA
        </button>

        <p className="text-center text-[#1A1A1A] text-xs mt-6">Roll & English — Jiu-Jitsu + Inglês</p>
      </div>
    </div>
  );
}