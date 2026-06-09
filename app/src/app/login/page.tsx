"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-center text-lg font-bold text-gray-800 mb-6">
          SPS – Sistema de Pesquisa e Satisfação
        </h1>

        <h2 className="text-base font-semibold text-gray-700 mb-4">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Institucional <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••••"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
            className="w-4 h-4 text-emerald-500 rounded"
          />
          <label className="ml-2 text-sm text-gray-600">Lembre-me</label>
        </div>

        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition">
          Entrar
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          É aluno e não possui conta?{" "}
          <a href="/cadastro-aluno" className="text-emerald-600 hover:underline">
            Criar Conta
          </a>
        </p>
      </div>
    </div>
  );
}