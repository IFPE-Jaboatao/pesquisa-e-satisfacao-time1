'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CadastroAluno() {
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');

  const handleCadastro = async (e: React.FormEvent) => {
  e.preventDefault();
  if (senha !== confirma) {
    alert('As senhas não coincidem!');
    return;
  }
  try {
    const res = await fetch('http://localhost:3001/users/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, matricula, senha }),
    });
    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      window.location.href = '/login';
    } else {
      const data = await res.json();
      alert(data.message || 'Erro ao cadastrar');
    }
  } catch {
    alert('Erro de conexão com o servidor');
  }
};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#4EBA86] p-4">
      <div className="mb-6 text-center text-white">
        <h1 className="text-xl font-bold tracking-wide uppercase">
          SPS – Sistema de Pesquisa e Satisfação
        </h1>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Cadastro de Aluno</h2>

        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Institucional *
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EBA86]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Matrícula *
            </label>
            <input
              type="text"
              placeholder="Digite sua matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EBA86]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EBA86]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Repita a senha *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirma}
              onChange={(e) => setConfirma(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EBA86]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#4EBA86] py-2 text-white font-semibold hover:bg-[#3da872] transition"
          >
            Criar conta
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-[#4EBA86] hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}