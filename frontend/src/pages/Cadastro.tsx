import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

const Cadastro = () => {
  const t = useT();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error(t.auth.cadastro.preenchaTodos);
      return;
    }
    if (password.length < 6) {
      toast.error(t.auth.cadastro.senhaCurta);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("spanish-ai-user", JSON.stringify({ name, email }));
    toast.success(t.auth.cadastro.contaCriada(name));
    navigate("/dashboard");
  };

  const fields = [
    { id: "name", label: t.auth.cadastro.nome, value: name, set: setName, type: "text", icon: User, ph: t.auth.cadastro.placeholderNome, autoComplete: "name" },
    { id: "email", label: t.auth.cadastro.email, value: email, set: setEmail, type: "email", icon: Mail, ph: "tu@email.com", autoComplete: "email" },
    { id: "password", label: t.auth.cadastro.senha, value: password, set: setPassword, type: "password", icon: Lock, ph: "••••••••", autoComplete: "new-password" },
  ];

  return (
    <AuthLayout
      title={t.auth.cadastro.title}
      subtitle={t.auth.cadastro.subtitle}
      footer={
        <>
          {t.auth.cadastro.jaTemConta}{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            {t.auth.cadastro.entrar}
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleAuthButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t.auth.google.or}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {fields.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * (i + 1) }}
            className="space-y-2"
          >
            <Label htmlFor={f.id}>{f.label}</Label>
            <div className="relative">
              <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id={f.id}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={f.ph}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </motion.div>
        ))}

        <Button type="submit" variant="spain" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.auth.cadastro.criar}
        </Button>

        <p className="text-xs text-muted-foreground text-center">{t.auth.cadastro.termos}</p>
      </form>
    </AuthLayout>
  );
};

export default Cadastro;
