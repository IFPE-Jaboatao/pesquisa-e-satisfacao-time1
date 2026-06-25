"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NovaClassePage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);
  const [form, setForm] = useState({ nome: "", codigo: "", cursoId: "", semestre: "", ano: "" });

  useEffect(() => {
    fetch("http://localhost:3001/cursos").then((r) => r.json()).then(setCursos).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    await fetch("http://localhost:3001/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/classes");
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="form-card">
          <h2 className="form-title">Cadastro de Classes</h2>
          <div className="form-group">
            <label className="form-label">Nome <span>*</span></label>
            <input className="form-control" placeholder="Digite seu nome" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Código <span>*</span></label>
            <input className="form-control" placeholder="Digite o código da classe" value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cursos <span>*</span></label>
            <select className="form-control" value={form.cursoId}
              onChange={(e) => setForm({ ...form, cursoId: e.target.value })}>
              <option value="">Redes de computadores</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Semestre <span>*</span></label>
              <select className="form-control" value={form.semestre}
                onChange={(e) => setForm({ ...form, semestre: e.target.value })}>
                <option value="">Semestre</option>
                {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ano <span>*</span></label>
              <input className="form-control" type="number" placeholder="1" value={form.ano}
                onChange={(e) => setForm({ ...form, ano: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Criar Classe</button>
        </div>
      </div>
    </div>
  );
}