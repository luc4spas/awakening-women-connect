import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import eventBanner from "@/assets/event-banner.jpeg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Mulheres Conectadas apresenta
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-2">
              Aprendendo a
            </h1>
            <h1 className="font-display text-6xl md:text-8xl font-extrabold text-primary italic leading-none mb-8">
              Despertar
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-12"
            style={{ boxShadow: "var(--orange-glow)" }}
          >
            <img
              src={eventBanner}
              alt="Banner do evento Aprendendo a Despertar - Mulheres Conectadas"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10"
          >
            <DetailCard label="Data" value="07 de Março" />
            <DetailCard label="Horário" value="16H" />
            <DetailCard label="Palavra" value="Miss. Kezia Souto" />
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center gap-4 md:gap-6 mb-12"
          >
            {["SPA", "Bazar", "Dinâmicas"].map((item) => (
              <span
                key={item}
                className="bg-primary/10 text-primary font-body font-semibold text-sm md:text-base px-5 py-2.5 rounded-full border border-primary/20"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={() => navigate("/inscricao")}
              className="bg-primary hover:bg-accent text-primary-foreground font-body font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              GARANTIR MINHA VAGA
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-muted-foreground font-body text-sm">
        <p>Dúvidas? Entre em contato: <a href="https://wa.me/5522988516911" className="text-primary hover:underline">(22) 98851-6911</a></p>
      </footer>
    </div>
  );
};

const DetailCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card rounded-xl px-6 py-4 shadow-sm border border-border text-center min-w-[140px]">
    <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
    <p className="font-display text-lg font-bold text-foreground">{value}</p>
  </div>
);

export default Index;
