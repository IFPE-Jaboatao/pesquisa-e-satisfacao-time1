 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

export default function NovoCampusPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    codigo: "",
    endereco: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("http://localhost:3001/campus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/campus");
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Cadastro de Campus</h1>
        </div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome <span>*</span></label>
              <input className="form-control" name="nome" placeholder="Digite seu nome" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Código <span>*</span></label>
              <input className="form-control" name="codigo" placeholder="Digite o código do campus" value={form.codigo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input className="form-control" name="endereco" placeholder="Digite o endereço" value={form.endereco} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Criar Campus</button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push("/campus")}>Cancelar</button>
          </form>
        </div>
      </div>
    </div>
  );
}