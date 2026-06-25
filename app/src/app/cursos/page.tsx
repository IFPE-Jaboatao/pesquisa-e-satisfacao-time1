"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/cursos").then((r) => r.json()).then(setCursos).catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciar Cursos</h1>
          <button className="btn-add" onClick={() => router.push("/cursos/novo")}>+ New Curso</button>
        </div>
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.codigo}</td>
                    <td>
                      <span className={`badge ${c.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm btn-sm-green" onClick={() => router.push(`/cursos/${c.id}`)}>Mais</button>
                        <button className="btn-sm btn-sm-gray" onClick={() => router.push(`/cursos/${c.id}/editar`)}>Editar</button>
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