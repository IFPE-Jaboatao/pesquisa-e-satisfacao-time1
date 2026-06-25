 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NovoCursoPage() {
  const router = useRouter();
  const [campi, setCampi] = useState<{ id: string; nome: string }[]>([]);
  const [form, setForm] = useState({
    nome: "",
    codigo: "",
    campusId: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/campus")
      .then(r => r.json())
      .then(setCampi)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  await fetch("http://localhost:3001/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  router.push("/cursos");
}

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Cadastro de Curso</h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Nome <span>*</span>
              </label>
              <input
                className="form-control"
                name="nome"
                placeholder="Digite o nome do curso"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Código <span>*</span>
              </label>
              <input
                className="form-control"
                name="codigo"
                placeholder="Digite o código do curso"
                value={form.codigo}
                onChange={handleChange}
                required
              />
            </div>

            <select
  className="form-control"
  name="campusId"
  value={form.campusId}
  onChange={handleChange}
  required
>
  <option value="">Selecione</option>
  {campi.map(c => (
    <option key={c.id} value={c.id}>{c.nome}</option>
  ))}
</select>
            </div>

            <button type="submit" className="btn btn-primary">
              Cadastrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push("/cursos")}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}