"use client";

import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

const campus = {
  nome: "Jaboatão",
  codigo: "JAB",
  status: "Ativo",
  endereco: "Av. Professor Luiz Freire, Jaboatão",
};

export default function DetalhesCampusPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Detalhes do campus</h1>
        </div>

        <div className="detail-card">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Nome:</label>
              <p>{campus.nome}</p>
            </div>
            <div className="detail-item">
              <label>Código:</label>
              <p>{campus.codigo}</p>
            </div>
          </div>

          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Status:</label>
            <p>
              <span className={`badge ${campus.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                {campus.status}
              </span>
            </p>
          </div>

          <div className="detail-item">
            <label>Endereço:</label>
            <p>{campus.endereco}</p>
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/campus/${params.id}/editar`)}
            >
              Editar Campus
            </button>
            <button className="btn btn-secondary">
              Inativar Campus
            </button>
            <button
              className="btn btn-danger"
              onClick={() => router.push("/campus")}
            >
              Excluir Campus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}