"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function EditarServicoPage() {
  const router = useRouter();
  const params = useParams();
  const [campi, setCampi] = useState<any[]>([]);
  const [form, setForm] = useState({ nome: "", campusId: "", descricao: "" });

  useEffect(() => {
    fetch(`http://localhost:3001/servicos/${params.id}`)
      .then((r) => r.json())
      .then((s) => setForm({ nome: s.nome, campusId: s.campusId, descricao: s.descricao }))
      .catch(() => {});
    fetch("http://localhost:3001/campus").then((r) => r.json()).then(setCampi).catch(() => {});
  }, [params.id]);

  const handleSubmit = async () => {
    await fetch(`http://localhost:3001/servicos/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push(`/servicos/${params.id}`);
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="form-card">
          <h2 className="form-title">Atualizar Serviços</h2>
          <div className="form-group">
            <label className="form-label">Nome <span>*</span></label>
            <input className="form-control" placeholder="Digite seu nome" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Campus <span>*</span></label>
            <select className="form-control" value={form.campusId}
              onChange={(e) => setForm({ ...form, campusId: e.target.value })}>
              <option value="">Selecione</option>
              {campi.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Descrição <span>*</span></label>
            <textarea className="form-control" rows={4} value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              style={{ resize: "vertical" }} />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Atualizar Serviço</button>
        </div>
      </div>
    </div>
  );
}