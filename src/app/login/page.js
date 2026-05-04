'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !senha) return setErro('Preencha email e senha');
    setLoading(true);
    setErro('');
    try {
      const r = await authAPI.login({ email, senha });
      login(r.data.token, r.data.user);
      router.push('/dashboard');
    } catch {
      setErro('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!nome || !email || !senha) return setErro('Preencha todos os campos');
    setLoading(true);
    setErro('');
    try {
      const r = await authAPI.register({ nome, email, senha });
      login(r.data.token, r.data.user);
      router.push('/dashboard');
    } catch {
      setErro('Erro ao criar conta. Tente outro email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🥋</span>
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white">ROLL & ENGLISH</h1>
          <p className="text-[#555] text-sm mt-1 tracking-widest">O INGLÊS DO TATAME</p>
          <div className="w-10 h-0.5 bg-red-600 mx-auto mt-3" />
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-[#111] rounded-xl p-1 border border-[#222]">
          <button
            onClick={() => setModo('login')}
            className={`flex-1 py-2 text-xs font-bold tracking-widest rounded-lg transition-all ${modo === 'login' ? 'bg-red-600 text-white' : 'text-[#444]'}`}
          >
            ENTRAR
          </button>
          <button
            onClick={() => setModo('register')}
            className={`flex-1 py-2 text-xs font-bold tracking-widest rounded-lg transition-all ${modo === 'register' ? 'bg-red-600 text-white' : 'text-[#444]'}`}
          >
            CRIAR CONTA
          </button>
        </div>

        {/* Form */}
        <form onSubmit={modo === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
          {modo === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-[#444]">NOME</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-widest text-[#444]">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-widest text-[#444]">SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-red-600/50"
            />
          </div>

          {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white font-bold tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 hover:bg-red-700 transition-colors"
          >
            {loading ? 'AGUARDE...' : modo === 'login' ? 'ENTRAR NO TATAME' : 'CRIAR CONTA'}
          </button>
        </form>

        {/* Frase */}
        <p className="text-center text-[#222] text-xs mt-10 italic">
          "The mat is the great equalizer."
        </p>

      </div>
    </div>
  );
}