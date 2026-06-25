"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/classes").then((r) => r.json()).then(setClasses).catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciar Classes</h1>
          <button className="btn-add" onClick={() => router.push("/classes/novo")}>+ Nova Classe</button>
        </div>
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Curso</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cl) => (
                  <tr key={cl.id}>
                    <td>{cl.nome}</td>
                    <td>{cl.codigo}</td>
                    <td>{cl.curso?.nome ?? cl.cursoId}</td>
                    <td>
                      <span className={`badge ${cl.status === "Ativo" ? "badge-active" : "badge-inactive"}`}>
                        {cl.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm btn-sm-green" onClick={() => router.push(`/classes/${cl.id}`)}>Mais</button>
                        <button className="btn-sm btn-sm-gray" onClick={() => router.push(`/classes/${cl.id}/editar`)}>Editar</button>
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