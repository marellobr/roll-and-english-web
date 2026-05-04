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

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function ProgressoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    userAPI.getMe().then(r => setDados(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pontos = dados?.user?.pontos_totais || 0;
  const streak = dados?.user?.streak_atual || 0;
  const palavras = dados?.user?.palavras_aprendidas || 0;
  const badge = getBadge(pontos);
  const proxBadge = BADGES.find(b => b.min > pontos);
  const ptsFaltam = proxBadge ? proxBadge.min - pontos : 0;
  const pctFaixa = proxBadge ? Math.round(((pontos - badge.min) / (proxBadge.min - badge.min)) * 100) : 100;
  const progresso = dados?.progresso;

  const hoje = new Date().getDay();
  const streakLogs = dados?.streakLogs || [];

  return (
    <div className="min-h-screen bg-[#080808] pb-16">
      <div className="max-w-2xl mx-auto px-5 pt-14">

        <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest mb-6 flex items-center gap-2">
          ← DASHBOARD
        </button>

        <h1 className="text-white text-2xl font-bold tracking-widest mb-1">PROGRESSO</h1>
        <div className="w-10 h-0.5 bg-red-600 mb-6" />

        {/* Faixa atual */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-8 rounded border-2 flex items-center justify-center" style={{ borderColor: badge.cor }}>
              <div className="w-6 h-3 rounded" style={{ backgroundColor: badge.cor + '40' }} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold tracking-widest">{badge.nome.toUpperCase()}</p>
              <p className="text-red-600 text-sm font-bold">{pontos} PTS</p>
            </div>
            <div className="bg-red-600/20 border border-red-600/40 rounded-lg px-3 py-1">
              <p className="text-red-500 font-bold text-sm">{pctFaixa}%</p>
            </div>
          </div>
          <div className="h-1.5 bg-[#1A1A1A] rounded-full mb-2">
            <div className="h-1.5 bg-red-600 rounded-full transition-all" style={{ width: `${pctFaixa}%` }} />
          </div>
          {proxBadge && (
            <p className="text-[#444] text-xs text-center tracking-widest">
              <span style={{ color: proxBadge.cor }}>■</span> {proxBadge.nome.toUpperCase()} — FALTAM {ptsFaltam} PTS
            </p>
          )}
        </div>

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { emoji: '🔥', val: streak, label: 'STREAK' },
            { emoji: '🏆', val: dados?.user?.recorde_streak || 0, label: 'RECORDE' },
            { emoji: '📚', val: palavras, label: 'PALAVRAS' },
            { emoji: '✅', val: progresso?.aulasConcluidas || 0, label: 'AULAS' },
          ].map((s, i) => (
            <div key={i} className="bg-[#111] border border-[#222] rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-white text-2xl font-bold">{s.val}</p>
              <p className="text-[#444] text-[9px] tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Últimos 7 dias */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">ÚLTIMOS 7 DIAS</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-4">
          <div className="flex justify-around">
            {Array.from({ length: 7 }).map((_, i) => {
              const diaIndex = (hoje - 6 + i + 7) % 7;
              const ativo = i === 6;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <p className="text-[#444] text-xs">{DIAS[diaIndex]}</p>
                  <div className={`w-8 h-8 rounded-full border-2 ${ativo ? 'bg-red-600 border-red-600' : 'bg-[#1A1A1A] border-[#2A2A2A]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Jornada */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">JORNADA</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#555] text-xs tracking-widest">AULAS CONCLUÍDAS</p>
            <p className="text-white font-bold">{progresso?.aulasConcluidas || 0}/{progresso?.totalAulas || 45}</p>
          </div>
          <div className="h-1.5 bg-[#1A1A1A] rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full transition-all" style={{ width: `${progresso?.percentual || 0}%` }} />
          </div>
        </div>

        {/* Faixas */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">FAIXAS</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col gap-3">
          {BADGES.map((b, i) => {
            const conquistada = pontos >= b.min;
            return (
              <div key={i} className={`flex items-center gap-3 ${!conquistada && 'opacity-30'}`}>
                <div className="w-10 h-6 rounded border-2" style={{ borderColor: b.cor, backgroundColor: b.cor + '20' }} />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{b.nome}</p>
                  <p className="text-[#444] text-xs">{b.min} pts</p>
                </div>
                {conquistada && <span className="text-green-400 text-sm">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}