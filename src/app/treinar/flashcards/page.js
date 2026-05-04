'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { wordsAPI } from '@/services/api';
import { falar } from '@/hooks/useAudio';

export default function FlashcardsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [atual, setAtual] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(0);
  const [rep, setRep] = useState(0);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    carregarCards();
  }, [user]);

  function carregarCards() {
    setLoading(true);
    wordsAPI.getVocab()
      .then(r => {
        const vocab = r.data.vocab || [];
        const embaralhado = [...vocab].sort(() => Math.random() - 0.5).slice(0, 15);
        setCards(embaralhado);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function acertei() {
    setOk(o => o + 1);
    avancar();
  }

  function errei() {
    setRep(r => r + 1);
    avancar();
  }

  function avancar() {
    setRevelado(false);
    if (atual >= cards.length - 1) {
      setConcluido(true);
    } else {
      setAtual(a => a + 1);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (concluido) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">⚡</div>
        <h2 className="text-white text-xl font-bold tracking-widest mb-6">SESSÃO CONCLUÍDA!</h2>
        <div className="flex justify-around mb-8">
          <div>
            <p className="text-green-400 text-3xl font-bold">{ok}</p>
            <p className="text-[#444] text-xs tracking-widest mt-1">ACERTOS</p>
          </div>
          <div className="w-px bg-[#222]" />
          <div>
            <p className="text-red-400 text-3xl font-bold">{rep}</p>
            <p className="text-[#444] text-xs tracking-widest mt-1">REPETIR</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setAtual(0); setOk(0); setRep(0); setConcluido(false); setRevelado(false); carregarCards(); }}
            className="bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest"
          >
            NOVA SESSÃO
          </button>
          <button onClick={() => router.push('/dashboard')}
            className="border border-[#222] text-[#555] font-bold py-3 rounded-xl tracking-widest text-sm">
            DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );

  const card = cards[atual];
  const progresso = Math.round((atual / cards.length) * 100);

  return (
    <div className="bg-[#080808] p-5 pt-14 flex flex-col" style={{ minHeight: '100dvh' }}>
      <div className="max-w-lg mx-auto">

        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest">
            ← SAIR
          </button>
          <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-2 flex items-center gap-4">
            <span className="text-green-400 font-bold">{ok}</span>
            <span className="text-[#333]">|</span>
            <span className="text-red-400 font-bold">{rep}</span>
            <span className="text-[#333]">|</span>
            <span className="text-[#555]">{cards.length - atual}</span>
          </div>
        </div>

        <div className="h-0.5 bg-[#1A1A1A] rounded-full mb-8">
          <div className="h-0.5 bg-red-600 rounded-full transition-all" style={{ width: `${progresso}%` }} />
        </div>

        <div
  className="flex-1 bg-[#111] border border-[#1A1A1A] rounded-2xl p-10 text-center cursor-pointer flex flex-col items-center justify-center gap-4 mb-6 hover:border-[#333] transition-all"
          onClick={() => setRevelado(!revelado)}
        >
          {!revelado ? (
            <>
              <p className="text-[#444] text-xs tracking-widest font-bold">ENGLISH</p>
              <p className="text-white text-4xl font-bold">{card?.palavra}</p>
              <button
                onClick={(e) => { e.stopPropagation(); falar(card?.palavra); }}
                className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center hover:bg-red-600/40 transition-all mt-2"
              >
                <span>🔊</span>
              </button>
              <p className="text-[#333] text-xs tracking-widest">CLIQUE PARA TRADUZIR</p>
            </>
          ) : (
            <>
              <p className="text-[#444] text-xs tracking-widest font-bold">PORTUGUÊS</p>
              <p className="text-white text-3xl font-bold">{card?.traducao}</p>
              {card?.exemplo && (
                <p className="text-[#555] text-sm italic mt-2">"{card.exemplo}"</p>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); falar(card?.palavra); }}
                className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center hover:bg-red-600/40 transition-all mt-2"
              >
                <span>🔊</span>
              </button>
            </>
          )}
        </div>

        {revelado ? (
          <div className="flex gap-3">
            <button onClick={errei}
              className="flex-1 py-4 bg-red-600/10 border border-red-600/40 text-red-400 font-bold rounded-xl tracking-widest hover:bg-red-600/20 transition-all">
              ERREI ✗
            </button>
            <button onClick={acertei}
              className="flex-1 py-4 bg-green-500/10 border border-green-500/40 text-green-400 font-bold rounded-xl tracking-widest hover:bg-green-500/20 transition-all">
              ACERTEI ✓
            </button>
          </div>
        ) : (
          <button onClick={() => setRevelado(true)}
            className="w-full py-4 bg-[#111] border border-[#222] text-[#555] font-bold rounded-xl tracking-widest hover:border-[#333] transition-all">
            REVELAR TRADUÇÃO
          </button>
        )}
      </div>
    </div>
  );
}