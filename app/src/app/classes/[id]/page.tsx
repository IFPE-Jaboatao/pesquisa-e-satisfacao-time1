"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function DetalhesClassePage() {
  const router = useRouter();
  const params = useParams();
  const [classe, setClasse] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/classes/${params.id}`)
      .then((r) => r.json()).then(setClasse).catch(() => {});
  }, [params.id]);

  if (!classe) return <div>Carregando...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="detail-card">
          <h2 className="form-title">Detalhes da classe</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Nome:</label>
              <p>{classe.nome}</p>
            </div>
            <div className="detail-item">
              <label>Código:</label>
              <p>{classe.codigo}</p>
            </div>
          </div>
          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Status:</label>
            <p>
              <span className={`badge ${classe.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                {classe.status}
              </span>
            </p>
          </div>
          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Curso:</label>
            <p>{classe.curso?.nome ?? classe.cursoId}</p>
          </div>
          <div className="detail-grid" style={{ marginBottom: 16 }}>
            <div className="detail-item">
              <label>Semestre:</label>
              <p>{classe.semestre}</p>
            </div>
            <div className="detail-item">
              <label>Ano:</label>
              <p>{classe.ano}</p>
            </div>
          </div>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => router.push(`/classes/${params.id}/editar`)}>Editar Classe</button>
            <button className="btn btn-secondary">Inativar Classe</button>
            <button className="btn btn-danger" onClick={() => router.push("/classes")}>Excluir Classe</button>
          </div>
        </div>
      </div>
    </div>
  );
}