"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const usuario = {
  nome: "Otavio Augusto",
  email: "otavio@email.com",
  status: "Ativo",
  perfis: ["Gestor"],
};

export default function DetalhesUsuarioPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Detalhes do usuário</h1>
        </div>

        <div className="detail-card">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Nome:</label>
              <p>{usuario.nome}</p>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <p>{usuario.email}</p>
            </div>
          </div>

          <div className="detail-item" style={{ marginBottom: 16 }}>
            <label>Status:</label>
            <p>
              <span className={`badge ${usuario.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                {usuario.status}
              </span>
            </p>
          </div>

          <p className="detail-section-title">Lista de perfis</p>
          {usuario.perfis.map((p) => (
            <div key={p} className="profile-tag">{p}</div>
          ))}

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/usuarios/${params.id}/editar`)}
            >
              Editar Usuário
            </button>
            <button className="btn btn-secondary">
              Inativar Usuário
            </button>
            <button
              className="btn btn-danger"
              onClick={() => router.push("/usuarios")}
            >
              Excluir Usuário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}