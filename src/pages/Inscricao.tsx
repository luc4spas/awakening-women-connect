import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const phoneSchema = z.object({
  nome: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use (XX) XXXXX-XXXX"),
});

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Inscricao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = phoneSchema.safeParse({ nome, whatsapp });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("inscricoes").insert({
      nome: result.data.nome,
      whatsapp: result.data.whatsapp,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Erro ao realizar inscrição", description: "Tente novamente.", variant: "destructive" });
      return;
    }
    navigate("/confirmacao");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Inscrição</h1>
            <p className="font-body text-muted-foreground">Preencha seus dados para garantir sua vaga</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1.5">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              {errors.nome && <p className="text-destructive text-sm mt-1 font-body">{errors.nome}</p>}
            </div>

            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1.5">WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                placeholder="(22) 98851-6911"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              {errors.whatsapp && <p className="text-destructive text-sm mt-1 font-body">{errors.whatsapp}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-primary-foreground font-body font-bold text-base py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "CONFIRMAR INSCRIÇÃO"}
            </button>
          </form>

          <p className="text-center text-muted-foreground font-body text-sm mt-6">
            Dúvidas?{" "}
            <a href="https://wa.me/5522988516911" className="text-primary hover:underline">
              (22) 98851-6911
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Inscricao;
