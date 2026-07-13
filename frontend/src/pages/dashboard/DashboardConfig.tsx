import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Volume2,
  Languages,
  Clock,
  Target,
  Sparkles,
  Eye,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/LanguageContext";
import {
  getNotifications,
  setNotifications,
  getReminderTime,
  setReminderTime,
  getSounds,
  setSounds,
  getDailyGoal,
  setDailyGoal,
  getDifficulty,
  setDifficulty,
  getShowTranslation,
  setShowTranslation,
  type ReminderTime,
  type DailyGoalMinutes,
  type Difficulty,
} from "@/lib/preferences";

const savedToast = (msg: string) => toast.success(msg, { duration: 1400 });

const DashboardConfig = () => {
  const t = useT();
  const v = t.dashboardViews.config;

  const [notif, setNotifState] = useState(true);
  const [reminder, setReminderState] = useState<ReminderTime>("evening");
  const [som, setSomState] = useState(true);
  const [dailyGoal, setDailyGoalState] = useState<DailyGoalMinutes>(20);
  const [difficulty, setDifficultyState] = useState<Difficulty>("auto");
  const [showTr, setShowTrState] = useState(true);

  useEffect(() => {
    setNotifState(getNotifications());
    setReminderState(getReminderTime());
    setSomState(getSounds());
    setDailyGoalState(getDailyGoal());
    setDifficultyState(getDifficulty());
    setShowTrState(getShowTranslation());
  }, []);

  const Row = ({
    icon: Icon,
    title,
    sub,
    children,
  }: {
    icon: typeof Bell;
    title: string;
    sub?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-warm border border-border">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm md:text-base">{title}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{v.titulo}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{v.subtitulo}</p>
      </motion.div>

      {/* Idioma + Notificações + Sons */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card space-y-3"
      >
        <h2 className="font-display text-xl mb-2">{v.prefGerais}</h2>
        <Row icon={Languages} title={v.idioma}>
          <LanguageSwitcher />
        </Row>
        <Row icon={Bell} title={v.notificacoes} sub={v.notificacoesSub}>
          <Switch
            checked={notif}
            onCheckedChange={(c) => {
              setNotifState(c);
              setNotifications(c);
              savedToast(v.configSalva);
            }}
          />
        </Row>
        <Row icon={Clock} title={v.horarioLembrete} sub={v.horarioLembreteSub}>
          <Select
            value={reminder}
            onValueChange={(val) => {
              const v2 = val as ReminderTime;
              setReminderState(v2);
              setReminderTime(v2);
              savedToast(v.configSalva);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">{v.reminderOptions.morning}</SelectItem>
              <SelectItem value="afternoon">{v.reminderOptions.afternoon}</SelectItem>
              <SelectItem value="evening">{v.reminderOptions.evening}</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row icon={Volume2} title={v.som} sub={v.somSub}>
          <Switch
            checked={som}
            onCheckedChange={(c) => {
              setSomState(c);
              setSounds(c);
              savedToast(v.configSalva);
            }}
          />
        </Row>
      </motion.section>

      {/* Estudo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card space-y-3"
      >
        <h2 className="font-display text-xl mb-2">{v.secaoEstudo}</h2>
        <Row icon={Target} title={v.metaDiaria} sub={v.metaDiariaSub}>
          <Select
            value={String(dailyGoal)}
            onValueChange={(val) => {
              const v2 = Number(val) as DailyGoalMinutes;
              setDailyGoalState(v2);
              setDailyGoal(v2);
              savedToast(v.configSalva);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 min</SelectItem>
              <SelectItem value="20">20 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row icon={Sparkles} title={v.dificuldade} sub={v.dificuldadeSub}>
          <Select
            value={difficulty}
            onValueChange={(val) => {
              const v2 = val as Difficulty;
              setDifficultyState(v2);
              setDifficulty(v2);
              savedToast(v.configSalva);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{v.diffOptions.auto}</SelectItem>
              <SelectItem value="easy">{v.diffOptions.easy}</SelectItem>
              <SelectItem value="hard">{v.diffOptions.hard}</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row
          icon={Eye}
          title={v.mostrarTraducao}
          sub={v.mostrarTraducaoSub}
        >
          <Switch
            checked={showTr}
            onCheckedChange={(c) => {
              setShowTrState(c);
              setShowTranslation(c);
              savedToast(v.configSalva);
            }}
          />
        </Row>
      </motion.section>

    </div>
  );
};

export default DashboardConfig;
