import { LayoutDashboard, GraduationCap, Gamepad2, TrendingUp, User, Settings, LogOut, Flame, PanelLeft, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SpanishLogo } from "@/components/SpanishLogo";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export const DashboardSidebar = () => {
  const t = useT();
  const { locale, setLocale } = useLanguage();
  const sb = t.dashboardSidebar;
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { title: "Início", url: "/", icon: Home, end: true, external: true },
    { title: sb.visaoGeral, url: "/dashboard", icon: LayoutDashboard, end: true },
    { title: sb.cursos, url: "/dashboard/cursos", icon: GraduationCap },
    { title: sb.jogos, url: "/dashboard/jogos", icon: Gamepad2 },
    { title: sb.progresso, url: "/dashboard/progresso", icon: TrendingUp },
  ];

  const conta = [
    { title: sb.perfil, url: "/dashboard/perfil", icon: User },
    { title: sb.configuracoes, url: "/dashboard/configuracoes", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("spanish-ai-user");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/70 p-2 gap-1">
        {collapsed ? (
          <>
            <Link to="/dashboard" className="flex items-center justify-center">
              <SpanishLogo size={28} withText={false} />
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expandir menu"
              className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <PanelLeft className="w-4 h-4 shrink-0" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Link to="/dashboard" className="flex items-center gap-2 px-1 py-1 min-w-0">
              <SpanishLogo size={36} withText />
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Recolher menu"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shrink-0"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
            {sb.menu}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded-xl h-10">
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={cn(
                        "flex items-center text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        collapsed ? "justify-center" : "gap-3 px-3",
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold border border-sidebar-primary/15 shadow-sm"
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
            {sb.conta}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conta.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded-xl h-10">
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        collapsed ? "justify-center" : "gap-3 px-3",
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold border border-sidebar-primary/15 shadow-sm"
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-secondary/25 border border-secondary/40">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">7</span>
            <span className="text-xs text-muted-foreground">{sb.dias}</span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={sb.sair}
              className={cn(
                "rounded-xl h-10 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                collapsed ? "justify-center" : "px-3",
              )}
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{sb.sair}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
