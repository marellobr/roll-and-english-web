'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

const MODOS = [
  { href: '/treinar/missao', titulo: 'MISSÃO DO DIA', sub: 'Aula diária completa', cor: '#E63946', icon: '🎯', destaque: true },
  { href: '/treinar/flashcards', titulo: 'FLASHCARDS', sub: 'Vocabulário do tatame', cor: '#E63946', icon: '⚡' },
  { href: '/treinar/professor', titulo: 'MODO PROFESSOR', sub: '75 frases reais de treino', cor: '#F4A261', icon: '👨‍🏫' },
  { href: '/treinar/completar', titulo: 'COMPLETE A FRASE', sub: 'Produza inglês ativamente', cor: '#2D6BE4', icon: '✍️' },
  { href: '/treinar/glossario', titulo: 'GLOSSÁRIO', sub: '37 termos do tatame', cor: '#2ECC71', icon: '📖' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dadosUser, setDadosUser] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    userAPI.getMe().then(r => setDadosUser(r.data)).catch(console.error);
  }, [user]);

  if (!user) return null;

  const pontos = dadosUser?.user?.pontos_totais || 0;
  const streak = dadosUser?.user?.streak_atual || 0;
  const palavras = dadosUser?.user?.palavras_aprendidas || 0;
  const badge = getBadge(pontos);
  const progresso = dadosUser?.progresso;

  return (
    <div className="min-h-screen bg-[#080808]" style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white">
            OSS, {user?.nome?.split(' ')[0].toUpperCase()}!
          </h1>
          <p className="text-[#555] text-xs tracking-widest mt-1">Missão diária pronta</p>
        </div>
        <div className="bg-[#1A0A0A] border border-red-600 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-base">🔥</span>
          <span className="text-red-600 font-bold text-lg">{streak}</span>
          <span className="text-[#555] text-[9px] tracking-widest">DIAS</span>
        </div>
      </div>

      {/* Faixa card */}
      <div className="mx-5 bg-[#111] border border-[#222] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-6 rounded border-2 flex items-center justify-center" style={{ borderColor: badge.cor, backgroundColor: badge.cor + '15' }}>
            <div className="w-5 h-2.5 rounded" style={{ backgroundColor: badge.cor + '40' }} />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm tracking-widest">{badge.nome.toUpperCase()}</p>
            <p className="text-red-600 text-xs font-bold">{pontos} PTS</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">{progresso?.aulasConcluidas || 0}/{progresso?.totalAulas || 45}</p>
            <p className="text-[#555] text-[9px] tracking-widest">AULAS</p>
          </div>
        </div>
        <div className="h-1 bg-[#1A1A1A] rounded-full">
          <div className="h-1 bg-red-600 rounded-full transition-all" style={{ width: `${progresso?.percentual || 0}%` }} />
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="mx-5 grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'PONTOS', val: pontos, cor: '#E63946' },
          { label: 'PALAVRAS', val: palavras, cor: '#2ECC71' },
          { label: 'AULAS', val: progresso?.aulasConcluidas || 0, cor: '#2D6BE4' },
        ].map((s, i) => (
          <div key={i} className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-center">
            <p className="font-bold text-lg" style={{ color: s.cor }}>{s.val}</p>
            <p className="text-[#444] text-[8px] tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3 mx-5 mb-4">
        <div className="flex-1 h-px bg-[#1A1A1A]" />
        <span className="text-[#333] text-[9px] font-bold tracking-widest">TREINAR</span>
        <div className="flex-1 h-px bg-[#1A1A1A]" />
      </div>

      {/* Missão destaque */}
      <button
        onClick={() => router.push('/treinar/missao')}
        className="mx-5 w-[calc(100%-40px)] flex items-center gap-4 bg-red-600 rounded-2xl p-5 mb-3 hover:bg-red-700 transition-colors text-left"
      >
        <span className="text-3xl">🎯</span>
        <div className="flex-1">
          <p className="text-white font-bold tracking-widest">MISSÃO DO DIA</p>
          <p className="text-red-200 text-xs mt-0.5">Aula diária completa com quiz</p>
        </div>
        <span className="text-white text-xl">›</span>
      </button>

      {/* Outros modos */}
      <div className="mx-5 flex flex-col gap-2 mb-24">
        {MODOS.slice(1).map((m, i) => (
          <button
            key={i}
            onClick={() => router.push(m.href)}
            className="flex items-center gap-4 bg-[#111] border border-[#1A1A1A] rounded-xl p-4 hover:border-[#333] transition-colors text-left w-full"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: m.cor + '15', border: `1px solid ${m.cor}30` }}>
              {m.icon}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm tracking-widest">{m.titulo}</p>
              <p className="text-[#555] text-xs mt-0.5">{m.sub}</p>
            </div>
            <span className="text-[#333] text-lg">›</span>
          </button>
        ))}
      </div>

      {/* Nav inferior */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-[#0D0D0D] border-t border-[#1A1A1A] flex" style={{ maxWidth: 480 }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Home' },
          { href: '/ranking', icon: '🏆', label: 'Ranking' },
          { href: '/progresso', icon: '📊', label: 'Progresso' },
          { href: '/config', icon: '⚙️', label: 'Config' },
        ].map((n, i) => (
          <button key={i} onClick={() => router.push(n.href)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[#444] hover:text-red-500 transition-colors">
            <span className="text-xl">{n.icon}</span>
            <span className="text-[9px] font-bold tracking-widest">{n.label.toUpperCase()}</span>
          </button>
        ))}
      </div>

    </div>
  );
}