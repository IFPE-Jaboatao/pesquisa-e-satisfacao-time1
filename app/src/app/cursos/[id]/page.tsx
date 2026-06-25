"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function DetalhesCursoPage() {
  const router = useRouter();
  const params = useParams();
  const [curso, setCurso] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/cursos/${params.id}`)
      .then((r) => r.json()).then(setCurso).catch(() => {});
  }, [params.id]);

  if (!curso) return <div>Carregando...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="detail-card">
          <h2 className="form-title">Detalhes do curso</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Nome:</label>
              <p>{curso.nome}</p>
            </div>
            <div className="detail-item">
              <label>Código:</label>
              <p>{curso.codigo}</p>
            </div>
          </div>
          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Status:</label>
            <p>
              <span className={`badge ${curso.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                {curso.status}
              </span>
            </p>
          </div>
          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Campus:</label>
            <p>{curso.campus?.nome ?? curso.campusId}</p>
          </div>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => router.push(`/cursos/${params.id}/editar`)}>Editar Curso</button>
            <button className="btn btn-secondary">Inativar Curso</button>
            <button className="btn btn-danger" onClick={() => router.push("/cursos")}>Excluir Curso</button>
          </div>
        </div>
      </div>
    </div>
  );
}