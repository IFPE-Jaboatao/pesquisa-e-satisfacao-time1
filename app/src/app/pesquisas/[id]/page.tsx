"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function DetalhesPesquisaPage() {
  const router = useRouter();
  const params = useParams();
  const [pesquisa, setPesquisa] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/pesquisas/${params.id}`)
      .then((r) => r.json()).then(setPesquisa).catch(() => {});
  }, [params.id]);

  if (!pesquisa) return <div>Carregando...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="detail-card" style={{ maxWidth: 600 }}>
          <h2 className="form-title">Detalhes da pesquisa</h2>
          <div className="detail-item" style={{ marginBottom: 8 }}>
            <label>Título</label>
            <p>{pesquisa.titulo}</p>
          </div>
          <div className="detail-item" style={{ marginBottom: 8 }}>
            <label>Status</label>
            <p>
              <span className={`badge ${pesquisa.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                {pesquisa.status}
              </span>
            </p>
          </div>
          <div className="detail-grid" style={{ marginBottom: 8 }}>
            <div className="detail-item">
              <label>Pesquisa Anônima</label>
              <p><span className={`badge ${pesquisa.anonima ? "badge-active" : "badge-inactive"}`}>{pesquisa.anonima ? "Sim" : "Não"}</span></p>
            </div>
            <div className="detail-item">
              <label>Quantidade de perguntas</label>
              <p>{pesquisa.questoes?.length ?? 0}</p>
            </div>
          </div>
          <div className="detail-grid" style={{ marginBottom: 8 }}>
            <div className="detail-item">
              <label>Data Inicial</label>
              <p>{pesquisa.dataInicial}</p>
            </div>
            <div className="detail-item">
              <label>Data Final</label>
              <p>{pesquisa.dataFinal}</p>
            </div>
          </div>
          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Descrição</label>
            <p>{pesquisa.descricao}</p>
          </div>
          {pesquisa.questoes?.map((q: any, i: number) => (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 10 }}>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>{i + 1}. {q.pergunta}</p>
              <div style={{ display: "flex", gap: 6 }}>
                <span className="badge badge-active">{q.tipo}</span>
                {q.obrigatoria && <span className="badge badge-inactive">Obrigatória</span>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => router.push(`/pesquisas/${params.id}/editar`)}>Editar Pesquisa</button>
            <button className="btn btn-secondary">Inativar Pesquisa</button>
            <button className="btn btn-danger" onClick={() => router.push("/pesquisas")}>Excluir Pesquisa</button>
          </div>
        </div>
      </div>
    </div>
  );
}