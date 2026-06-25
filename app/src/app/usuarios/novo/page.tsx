"use client";

import React from "react";

export default function CadastroUsuario() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Superior */}
      <header className="bg-[#00b289] text-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-xl">☰</button>
          <h1 className="text-lg font-semibold">SPS - Pesquisa e Satisfação</h1>
        </div>
        <button className="bg-white text-gray-700 px-4 py-1.5 rounded-xl text-sm font-medium shadow-sm">
          Minha Conta
        </button>
      </header>

      {/* Principal */}
      <main className="flex-1 p-6 max-w-md w-full mx-auto flex flex-col justify-between">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
            Cadastro de Usuário
          </h2>

          <form className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">👤</span>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00b289] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Campo email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Institucional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">✉️</span>
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00b289] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Campo Perfil */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Perfil <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00b289] focus:bg-white transition-all text-gray-500 appearance-none">
                <option value="gestor">Gestor</option>
                <option value="aluno">Aluno</option>
              </select>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔒</span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00b289] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Campo Repetir Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Repita a senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔒</span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00b289] focus:bg-white transition-all"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Botão Criar Usuario no Rodapé */}
        <button className="w-full bg-[#00b289] text-white py-3 rounded-xl font-medium mt-8 hover:bg-[#009a76] transition-colors shadow-sm">
          Criar Usuário
        </button>
      </main>
    </div>
  );
}