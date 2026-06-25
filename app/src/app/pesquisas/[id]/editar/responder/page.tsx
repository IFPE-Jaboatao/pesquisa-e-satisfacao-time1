"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function ResponderPesquisaPage() {
  const router = useRouter();
  const params = useParams();
  const [pesquisa, setPesquisa] = useState<any>(null);
  const [respostas, setRespostas] = useState<Record<number, any>>({});

  useEffect(() => {
    fetch(`http://localhost:3001/pesquisas/${params.id}`)
      .then((r) => r.json()).then(setPesquisa).catch(() => {});
  }, [params.id]);

  if (!pesquisa) return <div>Carregando...</div>;

  const handleResposta = (index: number, value: any) => {
    setRespostas({ ...respostas, [index]: value });
  };

  const handleSubmit = async () => {
    await fetch(`http://localhost:3001/pesquisas/${params.id}/respostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respostas }),
    });
    router.push("/pesquisas");
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="form-card" style={{ maxWidth: 600 }}>
          <h2 className="form-title">{pesquisa.titulo}</h2>
          {pesquisa.descricao && (
            <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 13 }}>
              {pesquisa.descricao}
            </p>
          )}

          {pesquisa.questoes?.map((q: any, i: number) => (
            <div key={i} className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">
                {i + 1}. {q.pergunta}
                {q.obrigatoria && <span className="badge badge-inactive" style={{ marginLeft: 8 }}>Obrigatória</span>}
              </label>

              {q.tipo === "Escala" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => handleResposta(i, n)}
                      style={{
                        width: 36, height: 36, borderRadius: 6,
                        border: "1px solid var(--border-color)",
                        background: respostas[i] === n ? "var(--accent-green)" : "var(--bg-input)",
                        color: respostas[i] === n ? "#000" : "var(--text-primary)",
                        cursor: "pointer", fontWeight: 600,
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {q.tipo === "Escolha única" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {(q.labels ?? [{ label: "Sim", value: "sim" }, { label: "Não", value: "nao" }]).map((l: any, j: number) => (
                    <label key={j} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="radio" name={`q${i}`} value={l.value}
                        checked={respostas[i] === l.value}
                        onChange={() => handleResposta(i, l.value)} />
                      {l.label}
                    </label>
                  ))}
                </div>
              )}

              {q.tipo === "Múltipla escolha" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {(q.labels ?? []).map((l: any, j: number) => (
                    <label key={j} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" value={l.value}
                        checked={(respostas[i] ?? []).includes(l.value)}
                        onChange={(e) => {
                          const current: string[] = respostas[i] ?? [];
                          handleResposta(i, e.target.checked
                            ? [...current, l.value]
                            : current.filter((v) => v !== l.value));
                        }} />
                      {l.label}
                    </label>
                  ))}
                </div>
              )}

              {q.tipo === "Texto" && (
                <textarea className="form-control" rows={3}
                  style={{ marginTop: 8, resize: "vertical" }}
                  placeholder="Digite sua resposta..."
                  value={respostas[i] ?? ""}
                  onChange={(e) => handleResposta(i, e.target.value)} />
              )}
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>Enviar Resposta</button>
            <button className="btn btn-secondary" onClick={() => router.back()}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}