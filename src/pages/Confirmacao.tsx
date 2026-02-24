import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Confirmacao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-card rounded-2xl shadow-lg border border-border p-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Inscrição Confirmada!
          </h1>
          <p className="font-body text-muted-foreground text-lg mb-6 leading-relaxed">
            Estamos ansiosas por te receber para este tempo de despertar.
          </p>

          <div className="bg-primary/10 rounded-xl p-5 mb-8 border border-primary/20">
            <p className="font-display text-xl font-bold text-foreground">07 de Março — 16H</p>
            <p className="font-body text-muted-foreground mt-1">Mulheres Conectadas</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="font-body text-primary hover:underline text-sm"
          >
            ← Voltar ao início
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmacao;
