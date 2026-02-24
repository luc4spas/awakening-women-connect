import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Inscricao {
  id: string;
  nome: string;
  whatsapp: string;
  created_at: string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Admin = () => {
  const navigate = useNavigate();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin-login"); return; }

      const { data: roles } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", user.id).eq("role", "admin");

      if (!roles || roles.length === 0) { navigate("/admin-login"); return; }

      const { data } = await supabase
        .from("inscricoes").select("*")
        .order("created_at", { ascending: false });

      setInscricoes((data as Inscricao[]) || []);
      setLoading(false);
    };
    checkAdminAndFetch();
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!search.trim()) return inscricoes;
    const q = search.toLowerCase();
    return inscricoes.filter((i) => i.nome.toLowerCase().includes(q));
  }, [inscricoes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 when search or pageSize changes
  useEffect(() => { setPage(1); }, [search, pageSize]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const exportCSV = () => {
    const source = filtered;
    const header = "Nome,WhatsApp,Data de Inscrição\n";
    const rows = source
      .map((i) => `"${i.nome}","${i.whatsapp}","${new Date(i.created_at).toLocaleDateString("pt-BR")}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscricoes-mulheres-conectadas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Painel Admin</h1>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Inscritas</h2>
            <span className="bg-primary/10 text-primary font-body font-semibold text-sm px-4 py-1.5 rounded-full">
              {filtered.length} {filtered.length !== inscricoes.length ? `de ${inscricoes.length}` : ""} inscritas
            </span>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="font-body text-muted-foreground">
              {search ? "Nenhuma inscrita encontrada com esse nome." : "Nenhuma inscrição ainda."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-body font-semibold text-sm text-muted-foreground px-6 py-3">#</th>
                    <th className="text-left font-body font-semibold text-sm text-muted-foreground px-6 py-3">Nome</th>
                    <th className="text-left font-body font-semibold text-sm text-muted-foreground px-6 py-3">WhatsApp</th>
                    <th className="text-left font-body font-semibold text-sm text-muted-foreground px-6 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item, index) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-body text-sm text-muted-foreground">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-6 py-4 font-body text-sm text-foreground font-medium">{item.nome}</td>
                      <td className="px-6 py-4 font-body text-sm text-foreground">{item.whatsapp}</td>
                      <td className="px-6 py-4 font-body text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                <span>Itens por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-background border border-input rounded-md px-2 py-1 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
