"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function ServicosPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/servicos")
      .then((r) => r.json())
      .then(setServicos)
      .catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciar Serviços</h1>
          <button className="btn-add" onClick={() => router.push("/servicos/novo")}>
            + Novo Serviço
          </button>
        </div>
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Campus</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nome}</td>
                    <td>{s.campus?.nome ?? s.campusId}</td>
                    <td>
                      <span className={`badge ${s.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm btn-sm-green" onClick={() => router.push(`/servicos/${s.id}`)}>Mais</button>
                        <button className="btn-sm btn-sm-gray" onClick={() => router.push(`/servicos/${s.id}/editar`)}>Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}