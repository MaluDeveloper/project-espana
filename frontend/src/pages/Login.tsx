import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

const Login = () => {
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t.auth.login.preenchaCampos);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    localStorage.setItem(
      "spanish-ai-user",
      JSON.stringify({ name: email.split("@")[0], email }),
    );
    toast.success(t.auth.login.bemVindo);
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title={t.auth.login.title}
      subtitle={t.auth.login.subtitle}
      footer={
        <>
          {t.auth.login.semConta}{" "}
          <Link to="/cadastro" className="text-primary font-semibold hover:underline">
            {t.auth.login.criar}
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
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-2"
        >
          <Label htmlFor="email">{t.auth.login.email}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              autoComplete="email"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="password">{t.auth.login.senha}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              autoComplete="current-password"
            />
          </div>
        </motion.div>

        <Button type="submit" variant="spain" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.auth.login.entrar}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
