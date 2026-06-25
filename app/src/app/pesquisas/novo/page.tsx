"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Questao {
  pergunta: string;
  tipo: string;
  obrigatoria: boolean;
  labels: { label: string; value: string }[];
}

export default function NovaPesquisaPage() {
  const router = useRouter();
  const [campi, setCampi] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [form, setForm] = useState({
    titulo: "", descricao: "", campusId: "", cursoId: "",
    servicoId: "", dataInicial: "", dataFinal: "", anonima: false,
  });
  const [questoes, setQuestoes] = useState<Questao[]>([
    { pergunta: "", tipo: "Múltipla escolha", obrigatoria: false, labels: [{ label: "", value: "" }] },
  ]);

  useEffect(() => {
    fetch("http://localhost:3001/campus").then((r) => r.json()).then(setCampi).catch(() => {});
    fetch("http://localhost:3001/cursos").then((r) => r.json()).then(setCursos).catch(() => {});
    fetch("http://localhost:3001/servicos").then((r) => r.json()).then(setServicos).catch(() => {});
  }, []);

  const addQuestao = () => {
    setQuestoes([...questoes, { pergunta: "", tipo: "Múltipla escolha", obrigatoria: false, labels: [{ label: "", value: "" }] }]);
  };

  const updateQuestao = (i: number, field: keyof Questao, value: any) => {
    const updated = [...questoes];
    (updated[i] as any)[field] = value;
    setQuestoes(updated);
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:3001/pesquisas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, questoes }),
    });
    router.push("/pesquisas");
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="form-card" style={{ maxWidth: 600 }}>
          <h2 className="form-title">Cadastro de Pesquisa</h2>

          <div className="form-group">
            <label className="form-label">Título <span>*</span></label>
            <input className="form-control" value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição <span>*</span></label>
            <textarea className="form-control" rows={3} value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              style={{ resize: "vertical" }} />
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
            <label className="form-label">Curso <span>*</span></label>
            <select className="form-control" value={form.cursoId}
              onChange={(e) => setForm({ ...form, cursoId: e.target.value })}>
              <option value="">Selecione</option>
              {cursos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Serviço <span>*</span></label>
            <select className="form-control" value={form.servicoId}
              onChange={(e) => setForm({ ...form, servicoId: e.target.value })}>
              <option value="">Selecione</option>
              {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Data Inicial <span>*</span></label>
              <input className="form-control" type="date" value={form.dataInicial}
                onChange={(e) => setForm({ ...form, dataInicial: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Data Final <span>*</span></label>
              <input className="form-control" type="date" value={form.dataFinal}
                onChange={(e) => setForm({ ...form, dataFinal: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pesquisa Anônima</label>
            <select className="form-control" value={form.anonima ? "sim" : "nao"}
              onChange={(e) => setForm({ ...form, anonima: e.target.value === "sim" })}>
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 12px" }}>
            <span className="detail-section-title">Questões</span>
            <button className="btn-add" onClick={addQuestao}>+ Adicionar Questão</button>
          </div>

          {questoes.map((q, i) => (
            <div key={i} className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Pergunta <span>*</span></label>
                <input className="form-control" placeholder="Digite sua pergunta"
                  value={q.pergunta} onChange={(e) => updateQuestao(i, "pergunta", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tipo <span>*</span></label>
                  <select className="form-control" value={q.tipo}
                    onChange={(e) => updateQuestao(i, "tipo", e.target.value)}>
                    <option value="Múltipla escolha">Múltipla escolha</option>
                    <option value="Escala">Escala</option>
                    <option value="Escolha única">Escolha única</option>
                    <option value="Texto">Texto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Obrigatória <span>*</span></label>
                  <select className="form-control" value={q.obrigatoria ? "sim" : "nao"}
                    onChange={(e) => updateQuestao(i, "obrigatoria", e.target.value === "sim")}>
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
              </div>
              {q.labels.map((l, j) => (
                <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Label {j + 1}</label>
                    <input className="form-control" value={l.label}
                      onChange={(e) => {
                        const updated = [...questoes];
                        updated[i].labels[j].label = e.target.value;
                        setQuestoes(updated);
                      }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value {j + 1}</label>
                    <input className="form-control" value={l.value}
                      onChange={(e) => {