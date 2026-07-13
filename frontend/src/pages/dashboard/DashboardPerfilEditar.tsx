import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Target,
  Upload,
  Trash2,
  Lock,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n/LanguageContext";

interface StoredUser {
  name: string;
  email: string;
  avatar?: string; // data URL
  goal?: string;
  password?: string;
}

const DEFAULT_USER: StoredUser = { name: "Maria", email: "maria@email.com" };
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const STORAGE_KEY = "spanish-ai-user";

const readUser = (): StoredUser => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
};

const writeUser = (u: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
};

const DashboardPerfilEditar = () => {
  const navigate = useNavigate();
  const t = useT();
  const v = t.dashboardViews.perfilEditar;
  const [user, setUser] = useState<StoredUser>(DEFAULT_USER);
  const fileRef = useRef<HTMLInputElement>(null);

  // Basic info (name + goal + avatar)
  const [savingBasic, setSavingBasic] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPwd, setEmailCurrentPwd] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Password change
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    setUser(readUser());
  }, []);

  const hasPassword = Boolean(user.password);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const update = <K extends keyof StoredUser>(key: K, value: StoredUser[K]) =>
    setUser((u) => ({ ...u, [key]: value }));

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(v.avatarHint);
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(v.avatarHint);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name.trim()) return;
    setSavingBasic(true);
    writeUser(user);
    toast.success(v.perfilAtualizado);
    setTimeout(() => setSavingBasic(false), 400);
  };

  const saveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !/^\S+@\S+\.\S+$/.test(newEmail)) return;
    if (newEmail.trim().toLowerCase() === user.email.toLowerCase()) return;
    if (hasPassword && emailCurrentPwd !== user.password) return;
    setSavingEmail(true);
    const updated = { ...user, email: newEmail.trim() };
    writeUser(updated);
    setUser(updated);
    setNewEmail("");
    setEmailCurrentPwd("");
    toast.success(v.emailAtualizado);
    setTimeout(() => setSavingEmail(false), 400);
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPassword && currentPwd !== user.password) return;
    if (newPwd.length < 6) return;
    if (newPwd !== confirmPwd) return;
    setSavingPwd(true);
    const updated = { ...user, password: newPwd };
    writeUser(updated);
    setUser(updated);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    toast.success(hasPassword ? v.senhaAtualizada : v.senhaDefinida);
    setTimeout(() => setSavingPwd(false), 400);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/perfil")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">{v.titulo}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{v.subtitulo}</p>
        </div>
      </motion.div>

      {/* Avatar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-spain rounded-3xl p-6 md:p-7 text-primary-foreground shadow-elevated"
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <Avatar className="w-24 h-24 border-4 border-primary-foreground/30">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-2xl font-display font-bold bg-secondary text-secondary-foreground">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-[200px]">
            <div className="font-display text-2xl md:text-3xl">{user.name || v.semNome}</div>
            <div className="text-sm opacity-90 mb-3">{user.email || "—"}</div>
            <div className="flex gap-2 flex-wrap">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarPick}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="font-bold"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                {user.avatar ? v.trocarFoto : v.enviarFoto}
              </Button>
              {user.avatar && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={() => update("avatar", undefined)}
                >
                  <Trash2 className="w-4 h-4" />
                  {v.remover}
                </Button>
              )}
            </div>
            <div className="text-[11px] opacity-80 mt-2">{v.avatarHint}</div>
          </div>
        </div>
      </motion.section>

      {/* Nome + Objetivo */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={saveBasic}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card space-y-5"
      >
        <h2 className="font-display text-xl">{v.infBasicas}</h2>

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> {v.nomeCompleto}
          </Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={v.nomePlaceholder}
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> {v.objetivoAprendizado}
          </Label>
          <Select value={user.goal ?? "travel"} onValueChange={(g) => update("goal", g)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">{v.goals.travel}</SelectItem>
              <SelectItem value="work">{v.goals.work}</SelectItem>
              <SelectItem value="study">{v.goals.study}</SelectItem>
              <SelectItem value="culture">{v.goals.culture}</SelectItem>
              <SelectItem value="other">{v.goals.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/perfil")}>
            {v.cancelar}
          </Button>
          <Button type="submit" variant="spain" className="font-bold" disabled={savingBasic}>
            <Save className="w-4 h-4" />
            {savingBasic ? v.salvando : v.salvar}
          </Button>
        </div>
      </motion.form>

      {/* Alterar email */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={saveEmail}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card space-y-5"
      >
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl">{v.alterarEmail}</h2>
        </div>

        <div className="space-y-2">
          <Label>{v.emailAtual}</Label>
          <Input value={user.email} readOnly disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-email">{v.novoEmail}</Label>
          <Input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="novo@email.com"
          />
        </div>

        {hasPassword && (
          <div className="space-y-2">
            <Label htmlFor="email-current-pwd">{v.senhaAtualConfirmar}</Label>
            <Input
              id="email-current-pwd"
              type="password"
              value={emailCurrentPwd}
              onChange={(e) => setEmailCurrentPwd(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="spain" className="font-bold" disabled={savingEmail}>
            <Save className="w-4 h-4" />
            {savingEmail ? v.salvando : v.atualizarEmail}
          </Button>
        </div>
      </motion.form>

      {/* Alterar senha */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onSubmit={savePassword}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card space-y-5"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl">
            {hasPassword ? v.alterarSenha : v.definirSenha}
          </h2>
        </div>

        {!hasPassword && (
          <p className="text-sm text-muted-foreground">{v.semSenha}</p>
        )}

        {hasPassword && (
          <div className="space-y-2">
            <Label htmlFor="current-pwd" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> {v.senhaAtual}
            </Label>
            <Input
              id="current-pwd"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="new-pwd">{v.novaSenha}</Label>
            <Input
              id="new-pwd"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder={v.novaSenhaMin}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pwd">{v.confirmarNovaSenha}</Label>
            <Input
              id="confirm-pwd"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="spain" className="font-bold" disabled={savingPwd}>
            <Save className="w-4 h-4" />
            {savingPwd ? v.salvando : hasPassword ? v.atualizarSenha : v.definirSenha}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default DashboardPerfilEditar;
