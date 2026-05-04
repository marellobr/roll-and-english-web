'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { rankingAPI } from '@/services/api';

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

function getDiasParaSegunda() {
  const hoje = new Date().getDay();
  return hoje === 0 ? 1 : 8 - hoje;
}

export default function RankingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [ranking, setRanking] = useState([]);
  const [minha, setMinha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    rankingAPI.getSemanal()
      .then(r => { setRanking(r.data.ranking || []); setMinha(r.data.minha); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const minhaPos = ranking.findIndex(r => r.id === user?.id) + 1;
  const diasRestantes = getDiasParaSegunda();
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-[#080808] pb-16">
      <div className="max-w-2xl mx-auto px-5 pt-14">

        <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest mb-6">
          ← DASHBOARD
        </button>

        <h1 className="text-white text-2xl font-bold tracking-widest mb-1">RANKING</h1>
        <div className="w-10 h-0.5 bg-red-600 mb-1" />
        <p className="text-[#555] text-xs tracking-widest mb-6">Reinicia em {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''}</p>

        {/* Minha posição */}
        <div className="bg-[#111] border border-red-600/30 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="flex-1 text-center">
            <p className="text-[#555] text-[9px] tracking-widest mb-1">SUA POSIÇÃO</p>
            <p className="text-red-600 text-3xl font-bold">#{minhaPos > 0 ? minhaPos : '—'}</p>
          </div>
          <div className="w-px h-10 bg-[#222]" />
          <div className="flex-1 text-center">
            <p className="text-white text-xl font-bold">{minha?.pontos_semana || 0}</p>
            <p className="text-[#444] text-[9px] tracking-widest">PTS SEMANA</p>
          </div>
          <div className="w-px h-10 bg-[#222]" />
          <div className="flex-1 text-center">
            <p className="text-white text-xl font-bold">{minha?.aulas_semana || 0}</p>
            <p className="text-[#444] text-[9px] tracking-widest">AULAS</p>
          </div>
        </div>

        {/* Top 3 pódio */}
        {ranking.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            {[1, 0, 2].map(idx => {
              const item = ranking[idx];
              const isFirst = idx === 0;
              return (
                <div key={idx} className={`flex flex-col items-center gap-1 ${isFirst ? 'mb-4' : ''}`}>
                  {isFirst && <span className="text-2xl">🏆</span>}
                  <div className={`rounded-full border-2 flex items-center justify-center font-bold text-white ${isFirst ? 'w-14 h-14 text-lg' : 'w-11 h-11 text-sm'}`}
                    style={{ borderColor: ['#FFD700', '#C0C0C0', '#CD7F32'][idx === 0 ? 0 : idx === 1 ? 1 : 2], backgroundColor: '#1A1A1A' }}>
                    {item?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'JJ'}
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-black text-[10px] font-bold`}
                    style={{ backgroundColor: ['#FFD700', '#C0C0C0', '#CD7F32'][idx === 0 ? 0 : idx === 1 ? 1 : 2] }}>
                    {[1, 2, 3][idx === 0 ? 0 : idx === 1 ? 1 : 2]}
                  </div>
                  <p className="text-white text-xs font-semibold">{item?.nome?.split(' ')[0]}</p>
                  <p className="text-[#888] text-[10px]">{item?.pontos_semana} pts</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Linha */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">TOP 10 DA SEMANA</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-2">
          {ranking.map((item, i) => {
            const badge = getBadge(item.pontos_totais);
            const isEu = item.id === user?.id;
            return (
              <div key={item.id} className={`flex items-center gap-3 rounded-xl p-3 border ${isEu ? 'border-red-600/40 bg-red-600/5' : 'border-[#1A1A1A] bg-[#111]'}`}>
                <div className="w-7 text-center">
                  {i < 3 ? <span className="text-lg">{medals[i]}</span> : <span className="text-[#444] font-bold text-sm">{i + 1}</span>}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {item.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'JJ'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isEu ? 'text-red-400' : 'text-white'}`}>
                    {item.nome?.split(' ')[0]} {isEu ? '(você)' : ''}
                  </p>
                  <p className="text-xs" style={{ color: badge.cor }}>{badge.nome}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isEu ? 'text-red-400' : 'text-white'}`}>{item.pontos_semana}</p>
                  <p className="text-[#444] text-[9px] tracking-widest">PTS</p>
                </div>
              </div>
            );
          })}
          {ranking.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#444] text-sm">Nenhum treino esta semana ainda.</p>
              <p className="text-[#333] text-xs mt-1">Faça sua aula do dia e apareça no ranking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}