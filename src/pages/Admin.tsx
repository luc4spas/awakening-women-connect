import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Download } from "lucide-react";

interface Inscricao {
  id: string;
  nome: string;
  whatsapp: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin-login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        navigate("/admin-login");
        return;
      }

      const { data } = await supabase
        .from("inscricoes")
        .select("*")
        .order("created_at", { ascending: false });

      setInscricoes((data as Inscricao[]) || []);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const exportCSV = () => {
    const header = "Nome,WhatsApp,Data de Inscrição\n";
    const rows = inscricoes
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
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Inscritas</h2>
          <span className="bg-primary/10 text-primary font-body font-semibold text-sm px-4 py-1.5 rounded-full">
            {inscricoes.length} inscritas
          </span>
        </div>

        {inscricoes.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="font-body text-muted-foreground">Nenhuma inscrição ainda.</p>
          </div>
        ) : (
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
                {inscricoes.map((item, index) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">{index + 1}</td>
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
        )}
      </main>
    </div>
  );
};

export default Admin;
