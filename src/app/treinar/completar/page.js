'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const FRASES = [
  { frase: "Don't let them pass your ___.", resposta: "guard", dica: "Posição defensiva com as pernas", contexto: "Professor gritando no sparring" },
  { frase: "Use your ___ to control distance.", resposta: "legs", dica: "Membros inferiores", contexto: "Trabalhando a guard aberta" },
  { frase: "Off balance them before the ___.", resposta: "sweep", dica: "Movimento que inverte a posição", contexto: "Preparando para raspar" },
  { frase: "Set your ___ to take the back.", resposta: "hooks", dica: "Ganchos com os pés", contexto: "Pegando as costas do oponente" },
  { frase: "Tap out to avoid ___.", resposta: "injury", dica: "Lesão em inglês", contexto: "Segurança no treino" },
  { frase: "Apply ___ to exhaust your opponent.", resposta: "pressure", dica: "Pressão em inglês", contexto: "Dominando o side control" },
  { frase: "Fight for the ___.", resposta: "underhook", dica: "Braço por baixo do braço adversário", contexto: "Batalha no clinch" },
  { frase: "___ to recover your guard.", resposta: "Shrimp", dica: "Movimento de fuga com os quadris", contexto: "Escapando do side control" },
  { frase: "Break the ___ before you pass.", resposta: "grip", dica: "Pegada em inglês", contexto: "Iniciando a passagem" },
  { frase: "Keep a strong ___.", resposta: "base", dica: "Equilíbrio e estrutura corporal", contexto: "Defendendo raspagens" },
  { frase: "Chain your ___ together.", resposta: "techniques", dica: "Técnicas em inglês", contexto: "Encadeando ataques" },
  { frase: "Extend the arm fully to finish the ___.", resposta: "armbar", dica: "Chave de braço", contexto: "Finalizando o armbar" },
  { frase: "Squeeze your legs to finish the ___.", resposta: "triangle", dica: "Finalização com as pernas", contexto: "Aplicando o triângulo" },
  { frase: "Cross the hip ___ to complete the pass.", resposta: "line", dica: "Linha em inglês", contexto: "Passando a guarda" },
  { frase: "Bridge and ___ to escape mount.", resposta: "roll", dica: "Rolar em inglês", contexto: "Escapando da montada" },
  { frase: "Let's ___!", resposta: "roll", dica: "Convite para fazer sparring", contexto: "Início do sparring" },
  { frase: "Control his head after you ___.", resposta: "pass", dica: "Passar a guarda em inglês", contexto: "Estabilizando após passagem" },
  { frase: "Use the knee ___ to pass the guard.", resposta: "slide", dica: "Deslizar em inglês", contexto: "Passagem pelo joelho" },
  { frase: "Stay ___ and flow.", resposta: "relaxed", dica: "Relaxado em inglês", contexto: "Filosofia do jiu-jitsu" },
  { frase: "There's no ___ in tapping.", resposta: "shame", dica: "Vergonha em inglês", contexto: "Segurança no treino" },
  { frase: "Drill to build ___ memory.", resposta: "muscle", dica: "Músculo em inglês", contexto: "Importância do drilling" },
  { frase: "Shift your weight to your ___.", resposta: "hips", dica: "Quadris em inglês", contexto: "Distribuição de peso" },
  { frase: "Adjust the ___ to finish the triangle.", resposta: "angle", dica: "Ângulo em inglês", contexto: "Finalizando o triângulo" },
  { frase: "Take the ___ to dominate.", resposta: "back", dica: "Costas em inglês", contexto: "Posição dominante" },
  { frase: "React to their ___.", resposta: "defense", dica: "Defesa em inglês", contexto: "Jiu-jitsu é ação e reação" },
];

function normalizar(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export default function CompletarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [frases] = useState(() => [...FRASES].sort(() => Math.random() - 0.5).slice(0, 15));
  const [atual, setAtual] = useState(0);
  const [resposta, setResposta] = useState('');
  const [respondida, setRespondida] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
  }, [user]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
    setMostrarDica(false);
  }, [atual]);

  function verificar() {
    if (!resposta.trim()) return;
    const correto = normalizar(resposta) === normalizar(frases[atual].resposta);
    setAcertou(correto);
    setRespondida(true);
    if (correto) setAcertos(a => a + 1);
  }

  function avancar() {
    if (atual < frases.length - 1) {
      setAtual(a => a + 1);
      setResposta('');
      setRespondida(false);
      setAcertou(false);
    } else {
      setConcluido(true);
    }
  }

  if (concluido) {
    const pct = Math.round((acertos / frases.length) * 100);
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🥋' : pct >= 60 ? '💪' : '📚'}</div>
          <h2 className="text-white text-xl font-bold tracking-widest mb-6">SESSÃO CONCLUÍDA!</h2>
          <div className="bg-[#0A0A0A] rounded-xl p-6 mb-6">
            <p className="text-red-600 text-5xl font-bold">{pct}%</p>
            <p className="text-[#444] text-xs tracking-widest mt-2">DE ACERTO</p>
            <div className="flex justify-around mt-4">
              <div>
                <p className="text-green-400 text-2xl font-bold">{acertos}</p>
                <p className="text-[#444] text-xs tracking-widest">CERTAS</p>
              </div>
              <div className="w-px bg-[#222]" />
              <div>
                <p className="text-red-400 text-2xl font-bold">{frases.length - acertos}</p>
                <p className="text-[#444] text-xs tracking-widest">ERRADAS</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.reload?.()} className="bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest">
              NOVA SESSÃO
            </button>
            <button onClick={() => router.push('/dashboard')} className="border border-[#222] text-[#555] font-bold py-3 rounded-xl tracking-widest text-sm">
              DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  const frase = frases[atual];
  const partes = frase.frase.split('___');
  const pct = (atual / frases.length) * 100;

  return (
    <div className="bg-[#080808] p-5 pt-14" style={{ minHeight: '100dvh' }}>
  <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest">
            ← SAIR
          </button>
          <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-2 flex items-center gap-4">
            <span className="text-green-400 font-bold">{acertos}</span>
            <span className="text-[#333]">|</span>
            <span className="text-red-400 font-bold">{atual - acertos}</span>
            <span className="text-[#333]">|</span>
            <span className="text-[#555]">{frases.length - atual}</span>
          </div>
        </div>

        {/* Progresso */}
        <div className="h-0.5 bg-[#1A1A1A] rounded-full mb-8">
          <div className="h-0.5 bg-red-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6 mb-4">

          {/* Contexto */}
          <div className="bg-[#0A0A0A] rounded-xl p-3 mb-5 border-l-2 border-red-600">
            <p className="text-red-600 text-[9px] font-bold tracking-widest mb-1">SITUAÇÃO</p>
            <p className="text-[#888] text-xs italic">{frase.contexto}</p>
          </div>

          {/* Frase com lacuna */}
          <p className="text-[#444] text-[9px] font-bold tracking-widest mb-3">COMPLETE A FRASE:</p>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-white text-lg font-semibold">{partes[0]}</span>
            <span className={`border-b-2 px-2 text-lg font-bold min-w-16 text-center ${respondida ? (acertou ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400') : 'border-red-600 text-red-600'}`}>
              {respondida ? frase.resposta : '___'}
            </span>
            {partes[1] && <span className="text-white text-lg font-semibold">{partes[1]}</span>}
          </div>

          {/* Input */}
          {!respondida && (
            <div className="flex gap-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={resposta}
                onChange={e => setResposta(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verificar()}
                placeholder="Digite em inglês..."
                className="flex-1 bg-[#0A0A0A] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50"
                autoComplete="off"
                autoCorrect="off"
              />
              <button
                onClick={() => setMostrarDica(!mostrarDica)}
                className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#222] flex items-center justify-center text-lg hover:border-[#444] transition-all"
              >
                💡
              </button>
            </div>
          )}

          {/* Dica */}
          {mostrarDica && !respondida && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-3">
              <p className="text-amber-400 text-[9px] font-bold tracking-widest mb-1">DICA</p>
              <p className="text-amber-300 text-sm">{frase.dica}</p>
            </div>
          )}

          {/* Feedback */}
          {respondida && (
            <div className={`rounded-xl p-4 mb-3 ${acertou ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <p className={`text-xs font-bold tracking-widest mb-1 ${acertou ? 'text-green-400' : 'text-red-400'}`}>
                {acertou ? '✓ CORRETO!' : '✗ ERROU!'}
              </p>
              {!acertou && (
                <p className="text-[#888] text-sm">
                  Resposta: <span className="text-green-400 font-bold">{frase.resposta}</span>
                </p>
              )}
              <p className="text-[#555] text-xs mt-1">{frase.dica}</p>
            </div>
          )}

          {/* Botões */}
          {!respondida ? (
            <button
              onClick={verificar}
              disabled={!resposta.trim()}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest disabled:opacity-40 hover:bg-red-700 transition-colors"
            >
              VERIFICAR
            </button>
          ) : (
            <button onClick={avancar} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest">
              {atual < frases.length - 1 ? 'PRÓXIMA →' : 'VER RESULTADO'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}