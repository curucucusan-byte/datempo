import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

async function loadLatestRules() {
  try {
    const dir = path.join(process.cwd(), "rules");
    const files = await fs.readdir(dir);
    const md = files.filter((f) => /\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().pop();
    if (!md) return { name: "", content: "Nenhuma regra encontrada." };
    const content = await fs.readFile(path.join(dir, md), "utf8");
    return { name: md, content };
  } catch {
    return { name: "", content: "Nenhuma regra encontrada." };
  }
}

export default async function RegrasPage() {
  const latest = await loadLatestRules();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Regras do Sistema</h1>
        {latest.name && <p className="text-slate-400 text-sm mt-1">Documento: {latest.name}</p>}
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <pre className="whitespace-pre-wrap text-sm text-slate-200">{latest.content}</pre>
        </div>
      </main>
    </div>
  );
}

