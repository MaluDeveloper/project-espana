import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown, Mail, Target, CalendarDays, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { toast } from "sonner";

const DashboardPerfil = () => {
  const t = useT();
  const v = t.dashboardViews.perfil;
  const navigate = useNavigate();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const userRaw = typeof window !== "undefined" ? localStorage.getItem("spanish-ai-user") : null;
  const user = userRaw ? JSON.parse(userRaw) : { name: "Maria", email: "maria@email.com" };

  const initials = (user.name as string)
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fields = [
    { label: v.campos.nome, value: user.name, icon: Crown },
    { label: v.campos.email, value: user.email ?? "—", icon: Mail },
    { label: v.campos.objetivo, value: (v.objetivos as Record<string, string>)[user.goal] ?? "—", icon: Target },
    { label: v.campos.membroDesde, value: v.desde, icon: CalendarDays },
  ];

  const handleLogout = () => {
    localStorage.removeItem("spanish-ai-user");
    toast.success(v.sessaoEncerrada);
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (deleteText.trim() !== v.confirmarExcluirPalavra) {
      toast.error(v.confirmarExcluirPlaceholder(v.confirmarExcluirPalavra));
      return;
    }
    localStorage.clear();
    toast.success(v.contaExcluida);
    navigate("/");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{v.titulo}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{v.subtitulo}</p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-spain rounded-3xl p-6 md:p-8 text-primary-foreground shadow-elevated"
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <Avatar className="w-20 h-20 border-4 border-primary-foreground/30">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-2xl font-display font-bold bg-secondary text-secondary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl md:text-3xl mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-secondary text-secondary-foreground gap-1 font-bold">
                <Crown className="w-3 h-3" /> {v.planoLabel}: {v.planoFree}
              </Badge>
            </div>
          </div>
          <Button variant="secondary" className="font-bold">{v.upgrade}</Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-warm border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">
                  {f.label}
                </div>
                <div className="font-semibold truncate">{f.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="spain" className="font-bold" onClick={() => navigate("/dashboard/perfil/editar")}>
            {v.editar}
          </Button>
        </div>
      </motion.section>

      {/* Zona de perigo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 md:p-7 border-2 border-destructive/30 bg-destructive/5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="font-display text-xl text-destructive">{v.zonaPerigo}</h2>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-destructive/20">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm md:text-base">{v.sairConta}</div>
            <div className="text-xs text-muted-foreground">{v.sairContaSub}</div>
          </div>
          <Button variant="outline" onClick={() => setLogoutOpen(true)}>
            {v.sairBtn}
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-destructive/20">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm md:text-base">{v.excluirConta}</div>
            <div className="text-xs text-muted-foreground">{v.excluirContaSub}</div>
          </div>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            {v.excluirBtn}
          </Button>
        </div>
      </motion.section>

      {/* Confirm logout */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{v.confirmarSair}</AlertDialogTitle>
            <AlertDialogDescription>{v.confirmarSairDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{v.cancelar}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>{v.sairBtn}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setDeleteText("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{v.confirmarExcluir}</AlertDialogTitle>
            <AlertDialogDescription>
              {v.confirmarExcluirDesc(v.confirmarExcluirPalavra)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder={v.confirmarExcluirPlaceholder(v.confirmarExcluirPalavra)}
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>{v.cancelar}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {v.confirmarExcluirBotao}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPerfil;
