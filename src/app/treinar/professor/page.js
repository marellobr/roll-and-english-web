'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { falar } from '@/hooks/useAudio';

const FRASES = [
  { fala: "Let's roll!", traducoes: ["Vamos fazer sparring!", "Vamos embora!", "Vamos fazer drilling!"], correta: "Vamos fazer sparring!" },
  { fala: "Tap out!", traducoes: ["Ataque!", "Bata para desistir!", "Defenda!"], correta: "Bata para desistir!" },
  { fala: "Good base!", traducoes: ["Boa faixa!", "Boa base!", "Bom sparring!"], correta: "Boa base!" },
  { fala: "Watch your posture!", traducoes: ["Cuidado com sua postura!", "Ataque mais!", "Mantenha a guarda!"], correta: "Cuidado com sua postura!" },
  { fala: "Don't let them pass your guard!", traducoes: ["Não deixe eles passarem sua guarda!", "Passe a guarda!", "Mantenha a pressão!"], correta: "Não deixe eles passarem sua guarda!" },
  { fala: "Control the distance!", traducoes: ["Controle a distância!", "Finalize!", "Raspe agora!"], correta: "Controle a distância!" },
  { fala: "Use your hips!", traducoes: ["Use seus braços!", "Use seus quadris!", "Use sua força!"], correta: "Use seus quadris!" },
  { fala: "Sweep from here!", traducoes: ["Finalize daqui!", "Raspe daqui!", "Passe daqui!"], correta: "Raspe daqui!" },
  { fala: "Set your hooks!", traducoes: ["Quebre a pegada!", "Coloque os ganchos!", "Passe a guarda!"], correta: "Coloque os ganchos!" },
  { fala: "Break the grip!", traducoes: ["Quebre a pegada!", "Finalize!", "Raspe!"], correta: "Quebre a pegada!" },
  { fala: "Stay tight!", traducoes: ["Fique solto!", "Fique firme/colado!", "Ataque!"], correta: "Fique firme/colado!" },
  { fala: "Take the back!", traducoes: ["Passe a guarda!", "Pegue as costas!", "Finalize!"], correta: "Pegue as costas!" },
  { fala: "Off balance first!", traducoes: ["Finalize primeiro!", "Desequilibre primeiro!", "Passe primeiro!"], correta: "Desequilibre primeiro!" },
  { fala: "Chain your techniques!", traducoes: ["Encadeie suas técnicas!", "Pare de atacar!", "Defenda!"], correta: "Encadeie suas técnicas!" },
  { fala: "Apply pressure!", traducoes: ["Recue!", "Aplique pressão!", "Raspe!"], correta: "Aplique pressão!" },
  { fala: "Keep a strong base!", traducoes: ["Ataque agora!", "Mantenha uma base forte!", "Solte a pegada!"], correta: "Mantenha uma base forte!" },
  { fala: "Fight for the underhook!", traducoes: ["Lute pelo underhook!", "Passe a guarda!", "Tape out!"], correta: "Lute pelo underhook!" },
  { fala: "Stabilize the position!", traducoes: ["Ataque imediatamente!", "Estabilize a posição!", "Solte!"], correta: "Estabilize a posição!" },
  { fala: "React to his defense!", traducoes: ["Ignore a defesa!", "Reaja à defesa dele!", "Recue!"], correta: "Reaja à defesa dele!" },
  { fala: "Hip escape!", traducoes: ["Fuga de quadril!", "Chave de braço!", "Passagem de guarda!"], correta: "Fuga de quadril!" },
  { fala: "Come on top!", traducoes: ["Fique por baixo!", "Venha por cima!", "Tape out!"], correta: "Venha por cima!" },
  { fala: "Extend the arm fully!", traducoes: ["Dobre o braço!", "Estenda o braço completamente!", "Solte o braço!"], correta: "Estenda o braço completamente!" },
  { fala: "Squeeze your legs!", traducoes: ["Solte as pernas!", "Abra as pernas!", "Aperte as pernas!"], correta: "Aperte as pernas!" },
  { fala: "Cross the hip line!", traducoes: ["Recue!", "Cruze a linha do quadril!", "Raspe!"], correta: "Cruze a linha do quadril!" },
  { fala: "Good sweep!", traducoes: ["Boa guarda!", "Boa raspagem!", "Boa finalização!"], correta: "Boa raspagem!" },
  { fala: "Pass the guard!", traducoes: ["Defenda a guarda!", "Passe a guarda!", "Raspe!"], correta: "Passe a guarda!" },
  { fala: "Sprawl!", traducoes: ["Ataque!", "Faça o sprawl!", "Raspe!"], correta: "Faça o sprawl!" },
  { fala: "Control his head!", traducoes: ["Controle a cabeça dele!", "Tape out!", "Raspe agora!"], correta: "Controle a cabeça dele!" },
  { fala: "Flatten him out!", traducoes: ["Deixe-o escapar!", "Achate-o!", "Raspe!"], correta: "Achate-o!" },
  { fala: "Block the hip!", traducoes: ["Solte o quadril!", "Bloqueie o quadril!", "Raspe!"], correta: "Bloqueie o quadril!" },
  { fala: "Go for the submission!", traducoes: ["Defenda!", "Vá para a finalização!", "Recue!"], correta: "Vá para a finalização!" },
  { fala: "Finish the armbar!", traducoes: ["Solte o armbar!", "Finalize o armbar!", "Escape!"], correta: "Finalize o armbar!" },
  { fala: "Lock the triangle!", traducoes: ["Solte o triângulo!", "Trave o triângulo!", "Raspe!"], correta: "Trave o triângulo!" },
  { fala: "Rear naked choke!", traducoes: ["Chave de braço!", "Mata-leão!", "Triângulo!"], correta: "Mata-leão!" },
  { fala: "Sink the choke deeper!", traducoes: ["Solte o estrangulamento!", "Afunde o estrangulamento!", "Raspe!"], correta: "Afunde o estrangulamento!" },
  { fala: "Slow down, focus on technique!", traducoes: ["Acelere, foque na força!", "Devagar, foque na técnica!", "Pare!"], correta: "Devagar, foque na técnica!" },
  { fala: "Again from the top!", traducoes: ["Pare agora!", "De novo do início!", "Finalize!"], correta: "De novo do início!" },
  { fala: "Relax and flow!", traducoes: ["Force e trave!", "Relaxe e flua!", "Pare!"], correta: "Relaxe e flua!" },
  { fala: "Trust the process!", traducoes: ["Desconfie do processo!", "Confie no processo!", "Pare!"], correta: "Confie no processo!" },
  { fala: "Protect yourself at all times!", traducoes: ["Ataque sempre!", "Proteja-se sempre!", "Solte a guarda!"], correta: "Proteja-se sempre!" },
  { fala: "You're improving!", traducoes: ["Você está piorando!", "Você está melhorando!", "Pare agora!"], correta: "Você está melhorando!" },
  { fala: "Recover your guard!", traducoes: ["Perca sua guarda!", "Recupere sua guarda!", "Tape out!"], correta: "Recupere sua guarda!" },
  { fala: "Bridge and roll!", traducoes: ["Fique parado!", "Faça a ponte e role!", "Tape out!"], correta: "Faça a ponte e role!" },
  { fala: "Establish both hooks!", traducoes: ["Retire os ganchos!", "Coloque os dois ganchos!", "Tape out!"], correta: "Coloque os dois ganchos!" },
  { fala: "Shrimp to create space!", traducoes: ["Fique parado!", "Faça o shrimp para criar espaço!", "Ataque!"], correta: "Faça o shrimp para criar espaço!" },
  { fala: "Be water!", traducoes: ["Seja pedra!", "Seja água!", "Seja fogo!"], correta: "Seja água!" },
];

export default function ProfessorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [frases, setFrases] = useState([]);
  const [atual, setAtual] = useState(0);
  const [selecionado, setSelecionado] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    const embaralhadas = [...FRASES].sort(() => Math.random() - 0.5).slice(0, 15);
    setFrases(embaralhadas);
  }, [user]);

  function responder(opcao) {
    if (respondido) return;
    setSelecionado(opcao);
    setRespondido(true);
    if (opcao === frases[atual].correta) setAcertos(a => a + 1);
  }

  function avancar() {
    if (atual < frases.length - 1) {
      setAtual(a => a + 1);
      setSelecionado(null);
      setRespondido(false);
    } else {
      setConcluido(true);
    }
  }

  function reiniciar() {
    const embaralhadas = [...FRASES].sort(() => Math.random() - 0.5).slice(0, 15);
    setFrases(embaralhadas);
    setAtual(0);
    setSelecionado(null);
    setRespondido(false);
    setAcertos(0);
    setConcluido(false);
  }

  if (!frases.length) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (concluido) {
    const pct = Math.round((acertos / frases.length) * 100);
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🥋' : pct >= 60 ? '💪' : '📚'}</div>
          <h2 className="text-white text-xl font-bold tracking-widest mb-2">SESSÃO CONCLUÍDA!</h2>
          <div className="bg-[#0A0A0A] rounded-xl p-6 my-6">
            <p className="text-red-600 text-5xl font-bold">{pct}%</p>
            <p className="text-[#444] text-xs tracking-widest mt-2">COMPREENSÃO</p>
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
            <button onClick={reiniciar} className="bg-red-600 text-white font-bold py-4 rounded-xl tracking-widest">
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
  const pct = (atual / frases.length) * 100;

  return (
    <div className="bg-[#080808] p-5 pt-14" style={{ minHeight: '100dvh' }}>
      <div className="max-w-lg mx-auto">

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

        <div className="h-0.5 bg-[#1A1A1A] rounded-full mb-8">
          <div className="h-0.5 bg-red-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {/* Card professor */}
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-600/10 border-2 border-red-600/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">👨‍🏫</span>
          </div>
          <div className="flex-1 bg-[#111] border border-[#1A1A1A] rounded-2xl rounded-tl-none p-5">
            <p className="text-red-600 text-[10px] font-bold tracking-widest mb-3">PROFESSOR DIZ:</p>
            <p className="text-white text-xl font-bold leading-relaxed">"{frase.fala}"</p>
            <button
              onClick={() => falar(frase.fala)}
              className="mt-3 flex items-center gap-2 text-red-600/60 hover:text-red-600 transition-all text-xs font-bold tracking-widest"
            >
              <span>🔊</span> OUVIR
            </button>
          </div>
        </div>

        <p className="text-[#444] text-[10px] font-bold tracking-widest text-center mb-4">O QUE ELE DISSE?</p>

        <div className="flex flex-col gap-3 mb-6">
          {frase.traducoes.map((op, i) => {
            const isCorreta = op === frase.correta;
            const isSelecionada = op === selecionado;
            let classes = 'flex items-center gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer w-full';
            if (respondido && isCorreta) classes += ' bg-green-500/10 border-green-500 text-green-400';
            else if (respondido && isSelecionada && !isCorreta) classes += ' bg-red-500/10 border-red-500 text-red-400';
            else if (respondido) classes += ' bg-[#0A0A0A] border-[#1A1A1A] text-[#333]';
            else classes += ' bg-[#111] border-[#222] text-[#CCC] hover:border-[#444]';

            return (
              <button key={i} className={classes} onClick={() => responder(op)} disabled={respondido}>
                <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${respondido && isCorreta ? 'border-green-500 bg-green-500/20 text-green-400' : respondido && isSelecionada ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-[#333] text-[#555]'}`}>
                  {['A', 'B', 'C'][i]}
                </span>
                <span className="text-sm flex-1">{op}</span>
                {respondido && isCorreta && <span className="text-green-400 text-lg">✓</span>}
                {respondido && isSelecionada && !isCorreta && <span className="text-red-400 text-lg">✗</span>}
              </button>
            );
          })}
        </div>

        {respondido && (
          <div className="flex items-center justify-between">
            <p className={`text-sm font-bold tracking-widest ${selecionado === frase.correta ? 'text-green-400' : 'text-red-400'}`}>
              {selecionado === frase.correta ? '✓ CORRETO!' : '✗ ERRADO!'}
            </p>
            <button onClick={avancar} className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl tracking-widest text-sm">
              {atual < frases.length - 1 ? 'PRÓXIMO →' : 'VER RESULTADO'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}