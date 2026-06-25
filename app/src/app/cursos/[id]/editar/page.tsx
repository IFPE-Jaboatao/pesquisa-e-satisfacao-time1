"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  const [campi, setCampi] = useState<any[]>([]);
  const [form, setForm] = useState({ nome: "", codigo: "", campusId: "" });

  useEffect(() => {
    fetch(`http://localhost:3001/cursos/${params.id}`)
      .then((r) => r.json())
      .then((c) => setForm({ nome: c.nome, codigo: c.codigo, campusId: c.campusId }))
      .catch(() => {});
    fetch("http://localhost:3001/campus").then((r) => r.json()).then(setCampi).catch(() => {});
  }, [params.id]);

  const handleSubmit = async () => {
    await fetch(`http://localhost:3001/cursos/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push(`/cursos/${params.id}`);
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="form-card">
          <h2 className="form-title">Atualização do Curso</h2>
          <div className="form-group">
            <label className="form-label">Nome <span>*</span></label>
            <input className="form-control" placeholder="Digite seu nome" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Código <span>*</span></label>
            <input className="form-control" placeholder="Digite o código do campus" value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Campus <span>*</span></label>
            <select className="form-control" value={form.campusId}
              onChange={(e) => setForm({ ...form, campusId: e.target.value })}>
              <option value="">Selecione</option>
              {campi.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Modificar Curso</button>
        </div>
      </div>
    </div>
  );
}