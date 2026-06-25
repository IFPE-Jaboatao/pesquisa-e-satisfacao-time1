"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
export default function NovoUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    emailInstitucional: "",
    perfil: "",
    senha: "",
    repetirSenha: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrar com API
    router.push("/usuarios");
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Cadastro de Usuário</h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Nome <span>*</span>
              </label>
              <input
                className="form-control"
                name="nome"
                placeholder="Digite seu nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Institucional <span>*</span>
              </label>
              <input
                className="form-control"
                name="emailInstitucional"
                type="email"
                placeholder="Digite seu e-mail"
                value={form.emailInstitucional}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Perfil <span>*</span>
              </label>
              <select
                className="form-control"
                name="perfil"
                value={form.perfil}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Gestor">Gestor</option>
                <option value="Admin">Admin</option>
                <option value="Usuário">Usuário</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Senha <span>*</span>
              </label>
              <div className="form-control-icon">
                <span className="icon">🔒</span>
                <input
                  className="form-control"
                  name="senha"
                  type="password"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Repita a senha <span>*</span>
              </label>
              <div className="form-control-icon">
                <span className="icon">🔒</span>
                <input
                  className="form-control"
                  name="repetirSenha"
                  type="password"
                  placeholder="••••••••"
                  value={form.repetirSenha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Cadastrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push("/usuarios")}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}