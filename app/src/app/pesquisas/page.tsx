"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function PesquisasPage() {
  const router = useRouter();
  const [pesquisas, setPesquisas] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/pesquisas").then((r) => r.json()).then(setPesquisas).catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciar Pesquisa</h1>
          <button className="btn-add" onClick={() => router.push("/pesquisas/novo")}>+ Nova Pesquisa</button>
        </div>
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Anônima?</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pesquisas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.titulo}</td>
                    <td>{p.anonima ? "Sim" : "Não"}</td>
                    <td>
                      <span className={`badge ${p.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm btn-sm-green" onClick={() => router.push(`/pesquisas/${p.id}`)}>Mais</button>
                        <button className="btn-sm btn-sm-gray" onClick={() => router.push(`/pesquisas/${p.id}/editar`)}>Editar</button>
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