'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { contentAPI } from '@/services/api';
import { falar } from '@/hooks/useAudio';

export default function MissaoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fase, setFase] = useState('aula'); // aula | quiz | concluido
  const [quizAtual, setQuizAtual] = useState(0);
  const [selecionada, setSelecionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    contentAPI.getMissaoDiaria()
      .then(r => setAula(r.data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleCheckin(acertosTotal, total) {
    try {
      await contentAPI.checkin(aula.id, acertosTotal, total);
      setFase('concluido');
    } catch (e) { console.error(e); }
  }

  function responder(alt) {
    if (respondida) return;
    setSelecionada(alt);
    setRespondida(true);
    if (alt === aula.quiz[quizAtual].resposta) setAcertos(a => a + 1);
  }

  function avancarQuiz() {
    const total = aula.quiz.length;
    const novosAcertos = acertos + (selecionada === aula.quiz[quizAtual].resposta ? 0 : 0);
    if (quizAtual < total - 1) {
      setQuizAtual(q => q + 1);
      setSelecionada(null);
      setRespondida(false);
    } else {
      handleCheckin(acertos + (selecionada === aula.quiz[quizAtual].resposta ? 1 : 0), total);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!aula) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-4 p-8">
      <span className="text-6xl">🏆</span>
      <h2 className="text-white text-xl font-bold tracking-widest text-center">CICLO COMPLETO!</h2>
      <p className="text-[#555] text-sm text-center">Você completou todas as aulas disponíveis!</p>
      <button onClick={() => router.push('/dashboard')} className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl tracking-widest">
        VOLTAR
      </button>
    </div>
  );

  const CATEGORIA_COR = { technique: '#E63946', command: '#F4A261', expression: '#2ECC71' };
  const CATEGORIA_LABEL = { technique: 'TÉCNICA', command: 'COMANDO', expression: 'EXPRESSÃO' };
  const cor = CATEGORIA_COR[aula.categoria] || '#E63946';

  // FASE CONCLUÍDO
  if (fase === 'concluido') return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#111] border border-red-600/30 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-white text-2xl font-bold tracking-widest mb-2">MISSÃO CONCLUÍDA!</h2>
        <div className="flex items-baseline justify-center gap-2 my-6">
          <span className="text-4xl">🔥</span>
          <span className="text-red-600 text-5xl font-bold">{acertos}</span>
          <span className="text-[#555] text-sm tracking-widest">/{aula.quiz.length} ACERTOS</span>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => router.push('/dashboard')} className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest">
            DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );

  // FASE QUIZ
  if (fase === 'quiz' && aula.quiz) {
    const pergunta = aula.quiz[quizAtual];
    const acertou = selecionada === pergunta.resposta;
    return (
      <div className="min-h-screen bg-[#080808] p-5 pt-14">
        <button onClick={() => setFase('aula')} className="text-red-600 text-xs font-bold tracking-widest mb-6 flex items-center gap-2">
          ← VOLTAR
        </button>

        {/* Progresso */}
        <div className="flex gap-2 mb-6 justify-center">
          {aula.quiz.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i < quizAtual ? 'bg-green-500 w-8' : i === quizAtual ? 'bg-red-600 w-8' : 'bg-[#222] w-4'}`} />
          ))}
        </div>

        <p className="text-[#444] text-[10px] font-bold tracking-widest text-center mb-6">
          PERGUNTA {quizAtual + 1} DE {aula.quiz.length}
        </p>

        <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-5 max-w-lg mx-auto">
          <p className="text-white text-base font-semibold mb-5 leading-relaxed">{pergunta.pergunta}</p>

          <div className="flex flex-col gap-3">
            {pergunta.alternativas.map((alt, i) => {
              const isCorreta = alt === pergunta.resposta;
              const isSelecionada = alt === selecionada;
              let classes = 'flex items-center gap-3 p-4 rounded-xl border transition-all text-left';
              if (respondida && isCorreta) classes += ' bg-green-500/10 border-green-500 text-green-400';
              else if (respondida && isSelecionada) classes += ' bg-red-500/10 border-red-500 text-red-400';
              else if (!respondida) classes += ' bg-[#0A0A0A] border-[#222] text-[#CCC] hover:border-[#444] cursor-pointer';
              else classes += ' bg-[#0A0A0A] border-[#222] text-[#444]';

              return (
                <button key={i} className={classes} onClick={() => responder(alt)} disabled={respondida}>
                  <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${respondida && isCorreta ? 'border-green-500 bg-green-500/20 text-green-400' : respondida && isSelecionada ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-[#333] text-[#555]'}`}>
                    {['A', 'B', 'C'][i]}
                  </span>
                  <span className="text-sm flex-1">{alt}</span>
                  {respondida && isCorreta && <span className="text-green-400">✓</span>}
                  {respondida && isSelecionada && !isCorreta && <span className="text-red-400">✗</span>}
                </button>
              );
            })}
          </div>

          {respondida && (
            <div className={`mt-4 p-3 rounded-xl ${acertou ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <p className={`text-xs font-bold tracking-widest ${acertou ? 'text-green-400' : 'text-red-400'}`}>
                {acertou ? 'CORRETO!' : 'ERROU!'}
              </p>
              {pergunta.explicacao && <p className="text-[#888] text-xs mt-1">{pergunta.explicacao}</p>}
            </div>
          )}

          {respondida && (
            <button onClick={avancarQuiz} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl mt-4 tracking-widest">
              {quizAtual < aula.quiz.length - 1 ? 'PRÓXIMA →' : 'VER RESULTADO'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // FASE AULA
  return (
    <div className="min-h-screen bg-[#080808] pb-16">
      <div className="max-w-2xl mx-auto px-5 pt-14">

        <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest mb-6 flex items-center gap-2">
          ← DASHBOARD
        </button>

        {/* Categoria + Título */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg"
            style={{ backgroundColor: cor + '20', color: cor, border: `1px solid ${cor}40` }}>
            {CATEGORIA_LABEL[aula.categoria]}
          </span>
          <h1 className="text-white text-2xl font-bold mt-3 leading-tight">{aula.titulo}</h1>
          <div className="w-10 h-0.5 mt-3" style={{ backgroundColor: cor }} />
        </div>

        {/* Transcrição */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4">
          <div className="flex gap-3 items-start mb-4">
  <span className="text-xl">🇺🇸</span>
  <p className="text-white text-sm leading-relaxed flex-1">{aula.transcricao}</p>
  <button
    onClick={() => falar(aula.transcricao)}
    className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center hover:bg-red-600/40 transition-all flex-shrink-0"
  >
    <span className="text-sm">🔊</span>
  </button>
</div>
          <div className="h-px bg-[#1A1A1A] mb-4" />
          <div className="flex gap-3 items-start">
            <span className="text-xl">🇧🇷</span>
            <p className="text-[#666] text-sm leading-relaxed flex-1">{aula.traducao}</p>
          </div>
        </div>

        {/* Vocabulário */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">VOCABULÁRIO</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {aula.vocabulario?.map((v, i) => (
            <span key={i} className="bg-[#111] border border-[#2A2A2A] text-[#CCC] text-xs px-3 py-2 rounded-lg">{v}</span>
          ))}
        </div>

        {/* Frases */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1A1A1A]" />
          <span className="text-[#444] text-[10px] font-bold tracking-widest">FRASES DO TATAME</span>
          <div className="flex-1 h-px bg-[#1A1A1A]" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-6 flex flex-col gap-3">
          {aula.frases?.map((f, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
              <p className="text-[#CCC] text-sm italic leading-relaxed">"{f}"</p>
            </div>
          ))}
        </div>

        {/* Botão Quiz */}
        <button
          onClick={() => setFase('quiz')}
          className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl tracking-widest flex items-center justify-center gap-3"
        >
          <span>💪</span> FAZER QUIZ
        </button>
      </div>
    </div>
  );
}