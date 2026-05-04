'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const GLOSSARIO = [
  { termo: 'Armbar', pronuncia: 'ARM-bar', categoria: 'finalização', pt: 'Chave de braço', descricao: 'Finalização que hiperextende o cotovelo. Aplicada de várias posições — guard, mount, side control.', exemplo: '"Extend the arm fully to finish the armbar."', nivel: 'branca' },
  { termo: 'Back mount', pronuncia: 'BACK mount', categoria: 'posição', pt: 'Pegada nas costas', descricao: 'Posição mais dominante. Você está atrás do oponente com ganchos nas coxas e controle do tronco.', exemplo: '"Take the back and set your hooks."', nivel: 'branca' },
  { termo: 'Base', pronuncia: 'BEIS', categoria: 'conceito', pt: 'Base / Equilíbrio', descricao: 'Estrutura corporal que mantém o equilíbrio. Boa base = difícil de raspar.', exemplo: '"Keep a strong base when you are on top."', nivel: 'branca' },
  { termo: 'Bridge', pronuncia: 'BRIDJ', categoria: 'movimento', pt: 'Ponte', descricao: 'Movimento explosivo de elevar os quadris para escapar da montada.', exemplo: '"Bridge and roll to escape mount."', nivel: 'branca' },
  { termo: 'Choke', pronuncia: 'TCHÓUK', categoria: 'finalização', pt: 'Estrangulamento', descricao: 'Finalização que corta o fluxo de sangue ou ar.', exemplo: '"Apply the choke tight to finish."', nivel: 'branca' },
  { termo: 'Collar grip', pronuncia: 'CÓLAR GRIP', categoria: 'pegada', pt: 'Pegada na gola', descricao: 'Pegada na gola do kimono. Usada para controlar a postura e iniciar ataques.', exemplo: '"Use the collar grip to break his posture."', nivel: 'branca' },
  { termo: 'De La Riva', pronuncia: 'DE LA RRÍVA', categoria: 'guarda', pt: 'Guarda De La Riva', descricao: 'Guarda aberta com gancho externo na perna do oponente.', exemplo: '"Set the DLR hook and control the collar."', nivel: 'azul' },
  { termo: 'Drilling', pronuncia: 'DRÍLING', categoria: 'treino', pt: 'Prática repetitiva', descricao: 'Praticar técnicas repetidamente sem resistência. Constrói memória muscular.', exemplo: '"Drill to build muscle memory."', nivel: 'branca' },
  { termo: 'Ezekiel choke', pronuncia: 'ÍZIKIEL TCHÓUK', categoria: 'finalização', pt: 'Estrangulamento Ezequiel', descricao: 'Estrangulamento usando a manga do próprio kimono. Muito eficaz da montada.', exemplo: '"Four fingers inside the sleeve for the Ezekiel."', nivel: 'azul' },
  { termo: 'Frame', pronuncia: 'FREIM', categoria: 'conceito', pt: 'Frame / Estrutura', descricao: 'Usar braços e pernas como estruturas rígidas para criar distância.', exemplo: '"Use your arms as frames to create space."', nivel: 'branca' },
  { termo: 'Guard', pronuncia: 'GÁRD', categoria: 'posição', pt: 'Guarda', descricao: 'Posição onde você está por baixo com as pernas controlando o oponente.', exemplo: '"Don\'t let them pass your guard."', nivel: 'branca' },
  { termo: 'Half guard', pronuncia: 'HALF GÁRD', categoria: 'guarda', pt: 'Meia guarda', descricao: 'Você controla uma das pernas do oponente entre as suas.', exemplo: '"Fight for the underhook from half guard."', nivel: 'branca' },
  { termo: 'Hip escape', pronuncia: 'HIP ESKÉIP', categoria: 'movimento', pt: 'Fuga de quadril', descricao: 'Também chamado de shrimp. Move os quadris para longe criando espaço.', exemplo: '"Shrimp to recover your guard."', nivel: 'branca' },
  { termo: 'Hook', pronuncia: 'HUK', categoria: 'controle', pt: 'Gancho', descricao: 'Gancho com o pé ou perna para controlar o oponente.', exemplo: '"Set your hooks to control from the back."', nivel: 'branca' },
  { termo: 'Kimono', pronuncia: 'KIMÓNO', categoria: 'equipamento', pt: 'Kimono / Gi', descricao: 'Uniforme do jiu-jitsu. As pegadas criam infinitas opções de controle.', exemplo: '"Use the kimono grips to control the distance."', nivel: 'branca' },
  { termo: 'Knee slide', pronuncia: 'NII SLAID', categoria: 'passagem', pt: 'Passagem pelo joelho', descricao: 'Passagem de guarda onde o joelho desliza pela coxa do oponente.', exemplo: '"Slide your knee across the thigh to pass."', nivel: 'azul' },
  { termo: 'Leg drag', pronuncia: 'LEG DRAG', categoria: 'passagem', pt: 'Arrastar a perna', descricao: 'Passagem que arrasta a perna do oponente pelo corpo.', exemplo: '"Drag the leg across his body to pass."', nivel: 'azul' },
  { termo: 'Mount', pronuncia: 'MAUNT', categoria: 'posição', pt: 'Montada', descricao: 'Posição onde você está sentado sobre o peito do oponente.', exemplo: '"Keep pressure on their chest from mount."', nivel: 'branca' },
  { termo: 'Off balance', pronuncia: 'OF BÁLANS', categoria: 'conceito', pt: 'Desequilíbrio', descricao: 'Desequilibrar o oponente antes de raspar ou atacar.', exemplo: '"Off balance them before the sweep."', nivel: 'branca' },
  { termo: 'Posture', pronuncia: 'PÓSCHER', categoria: 'conceito', pt: 'Postura', descricao: 'Como você mantém o corpo. Quebrar a postura do oponente é fundamental.', exemplo: '"Break his posture to set up the sweep."', nivel: 'branca' },
  { termo: 'Pressure', pronuncia: 'PRÉSHER', categoria: 'conceito', pt: 'Pressão', descricao: 'Usar o peso corporal de forma inteligente para cansar o oponente.', exemplo: '"Apply pressure to exhaust him."', nivel: 'branca' },
  { termo: 'Rear naked choke', pronuncia: 'RIER NEIKID TCHÓUK', categoria: 'finalização', pt: 'Mata-leão', descricao: 'Estrangulamento pelas costas. O mais eficaz e direto.', exemplo: '"Set your hooks and go for the rear naked choke."', nivel: 'branca' },
  { termo: 'Roll', pronuncia: 'RÔUL', categoria: 'treino', pt: 'Rolar / Sparring', descricao: '"Let\'s roll" = convite para sparring.', exemplo: '"Want to roll after class?"', nivel: 'branca' },
  { termo: 'Seatbelt grip', pronuncia: 'SÍTBELT GRIP', categoria: 'pegada', pt: 'Pegada de cinto', descricao: 'Pegada usada no back mount. Um braço por cima e outro por baixo.', exemplo: '"Use the seatbelt grip to control from the back."', nivel: 'azul' },
  { termo: 'Side control', pronuncia: 'SAID CONTRÓL', categoria: 'posição', pt: 'Controle lateral', descricao: 'Posição ao lado do oponente. Use o cotovelo para bloquear o quadril.', exemplo: '"Block the hip with your elbow from side control."', nivel: 'branca' },
  { termo: 'Sparring', pronuncia: 'SPÁRING', categoria: 'treino', pt: 'Treino vivo', descricao: 'Treino com resistência real. Testa suas técnicas sob pressão.', exemplo: '"Test your techniques in sparring."', nivel: 'branca' },
  { termo: 'Sprawl', pronuncia: 'SPRÔUL', categoria: 'defesa', pt: 'Sprawl', descricao: 'Defesa contra derrubadas. Jogue o quadril para trás e baixo.', exemplo: '"Sprawl to defend the takedown."', nivel: 'branca' },
  { termo: 'Submission', pronuncia: 'SUBMÍSHON', categoria: 'finalização', pt: 'Finalização', descricao: 'Qualquer técnica que força o oponente a bater.', exemplo: '"Chain your submissions together."', nivel: 'branca' },
  { termo: 'Sweep', pronuncia: 'SUÍIP', categoria: 'movimento', pt: 'Raspagem', descricao: 'Reverte a posição de baixo para cima.', exemplo: '"Use momentum to finish the sweep."', nivel: 'branca' },
  { termo: 'Tap out', pronuncia: 'TAP AUT', categoria: 'segurança', pt: 'Bater / Desistir', descricao: 'Bater no tatame ou no parceiro para indicar desistência.', exemplo: '"Tap early to prevent injury."', nivel: 'branca' },
  { termo: 'Triangle', pronuncia: 'TRAIENGL', categoria: 'finalização', pt: 'Triângulo', descricao: 'Estrangulamento com as pernas em formato triangular.', exemplo: '"Squeeze your legs to finish the triangle."', nivel: 'branca' },
  { termo: 'Underhook', pronuncia: 'ANDER-HUK', categoria: 'controle', pt: 'Underhook', descricao: 'Braço passado por baixo do braço do oponente. Quem tem controla.', exemplo: '"Fight for the underhook in half guard."', nivel: 'branca' },
  { termo: 'X-guard', pronuncia: 'EKS GÁRD', categoria: 'guarda', pt: 'Guarda X', descricao: 'Guarda que usa as duas pernas para controlar uma perna do oponente.', exemplo: '"Enter the X-guard to lift and sweep."', nivel: 'roxa' },
  { termo: 'Lasso guard', pronuncia: 'LÁSSO GÁRD', categoria: 'guarda', pt: 'Guarda Lasso', descricao: 'Guarda onde a perna envolve o braço do oponente como um laço.', exemplo: '"Wrap the lasso around his arm to control."', nivel: 'roxa' },
  { termo: 'Takedown', pronuncia: 'TÉIKDAUN', categoria: 'movimento', pt: 'Derrubada', descricao: 'Levar o oponente ao chão a partir de pé.', exemplo: '"Sprawl to defend the takedown."', nivel: 'azul' },
  { termo: 'Bridge and roll', pronuncia: 'BRIDJ END RÔUL', categoria: 'movimento', pt: 'Ponte e rolar', descricao: 'Escape da montada combinando ponte e rolamento.', exemplo: '"Bridge and roll to escape the mount."', nivel: 'branca' },
  { termo: 'Hip escape', pronuncia: 'HIP ESKÉIP', categoria: 'movimento', pt: 'Fuga de quadril', descricao: 'Movimento de camarão para criar espaço e recuperar a guarda.', exemplo: '"Hip escape to recover your guard."', nivel: 'branca' },
];

const CATEGORIAS = ['todas', 'posição', 'guarda', 'passagem', 'finalização', 'movimento', 'conceito', 'pegada', 'controle', 'treino', 'defesa', 'segurança', 'equipamento'];
const CORES = { 'posição': '#E63946', 'guarda': '#2D6BE4', 'passagem': '#F4A261', 'finalização': '#E63946', 'movimento': '#2ECC71', 'conceito': '#8B5CF6', 'pegada': '#F4A261', 'controle': '#2D6BE4', 'treino': '#2ECC71', 'defesa': '#888', 'segurança': '#2ECC71', 'equipamento': '#888' };
const CORES_NIVEL = { 'branca': '#FFF', 'azul': '#2D6BE4', 'roxa': '#8B5CF6', 'marrom': '#92400E', 'preta': '#444' };

export default function GlossarioPage() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [selecionado, setSelecionado] = useState(null);

  const filtrado = useMemo(() => {
    return GLOSSARIO.filter(t => {
      const matchBusca = !busca || t.termo.toLowerCase().includes(busca.toLowerCase()) || t.pt.toLowerCase().includes(busca.toLowerCase());
      const matchCat = categoria === 'todas' || t.categoria === categoria;
      return matchBusca && matchCat;
    }).sort((a, b) => a.termo.localeCompare(b.termo));
  }, [busca, categoria]);

  if (selecionado) {
    const cor = CORES[selecionado.categoria] || '#E63946';
    const corNivel = CORES_NIVEL[selecionado.nivel] || '#FFF';
    return (
      <div className="min-h-screen bg-[#080808] p-5 pt-14 max-w-2xl mx-auto">
        <button onClick={() => setSelecionado(null)} className="text-red-600 text-xs font-bold tracking-widest mb-6 flex items-center gap-2">
          ← GLOSSÁRIO
        </button>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <div className="flex gap-2 mb-4">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full tracking-widest" style={{ backgroundColor: cor + '20', color: cor, border: `1px solid ${cor}40` }}>
              {selecionado.categoria.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full tracking-widest border flex items-center gap-1" style={{ borderColor: corNivel + '60', color: corNivel }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: corNivel }} />
              FAIXA {selecionado.nivel.toUpperCase()}
            </span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1">{selecionado.termo}</h1>
          <p className="text-[#555] text-sm italic mb-1">/{selecionado.pronuncia}/</p>
          <p className="text-[#888] text-base mb-4">{selecionado.pt}</p>
          <div className="h-px bg-[#1A1A1A] mb-4" />
          <p className="text-[#444] text-[9px] font-bold tracking-widest mb-2">DESCRIÇÃO</p>
          <p className="text-[#CCC] text-sm leading-relaxed mb-4">{selecionado.descricao}</p>
          <div className="bg-[#0A0A0A] rounded-xl p-4 border-l-3 border-red-600" style={{ borderLeftWidth: 3, borderLeftColor: '#E63946' }}>
            <p className="text-red-600 text-[9px] font-bold tracking-widest mb-2">EXEMPLO DE USO</p>
            <p className="text-[#DDD] text-sm italic leading-relaxed">{selecionado.exemplo}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-2xl mx-auto">
        <div className="px-5 pt-14 pb-4">
          <button onClick={() => router.push('/dashboard')} className="text-red-600 text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
            ← DASHBOARD
          </button>
          <h1 className="text-white text-2xl font-bold tracking-widest mb-1">GLOSSÁRIO</h1>
          <div className="w-10 h-0.5 bg-red-600 mb-2" />
          <p className="text-[#555] text-xs tracking-widest">{GLOSSARIO.length} termos • inglês do tatame</p>
        </div>

        <div className="px-5 mb-3">
          <input
            type="text"
            placeholder="Buscar em inglês ou português..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 px-5 pb-3">

          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest whitespace-nowrap transition-all border ${categoria === cat ? 'bg-red-600/20 border-red-600/60 text-red-500' : 'bg-[#111] border-[#222] text-[#444]'}`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <p className="text-[#333] text-[9px] tracking-widest px-5 mb-3">{filtrado.length} TERMO{filtrado.length !== 1 ? 'S' : ''}</p>

        <div className="px-5 flex flex-col gap-2 pb-16">
          {filtrado.map((item, i) => {
            const cor = CORES[item.categoria] || '#E63946';
            const corNivel = CORES_NIVEL[item.nivel] || '#FFF';
            return (
              <button key={i} onClick={() => setSelecionado(item)}
                className="flex items-center bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-all text-left w-full">
                <div className="w-1 self-stretch" style={{ backgroundColor: cor }} />
                <div className="flex-1 p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white text-sm font-semibold">{item.termo}</p>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: corNivel }} />
                  </div>
                  <p className="text-[#888] text-xs">{item.pt}</p>
                  <p className="text-[#444] text-xs italic">/{item.pronuncia}/</p>
                </div>
                <span className="text-[#333] text-lg pr-3">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}