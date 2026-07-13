import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { applyFontSize } from "@/lib/preferences";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardCursos from "./pages/dashboard/DashboardCursos";
import DashboardJogos from "./pages/dashboard/DashboardJogos";
import DashboardProgresso from "./pages/dashboard/DashboardProgresso";
import DashboardPerfil from "./pages/dashboard/DashboardPerfil";
import DashboardPerfilEditar from "./pages/dashboard/DashboardPerfilEditar";
import DashboardConfig from "./pages/dashboard/DashboardConfig";
import Aula from "./pages/Aula";
import Jogos from "./pages/Jogos";
import Categoria from "./pages/Categoria";
import Fase from "./pages/Fase";
import Cursos from "./pages/Cursos";
import NivelCurso from "./pages/NivelCurso";
import Capitulo from "./pages/Capitulo";
import Prueba from "./pages/Prueba";
import DeleDetail from "./pages/DeleDetail";
import NotFound from "./pages/NotFound.tsx";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evita recargas automáticas que poderiam fazer a tela "piscar"
      // ou remontar componentes enquanto o usuário lê um capítulo.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  useEffect(() => {
    applyFontSize();
  }, []);
  return (
  <ErrorBoundary>
  <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>

        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas — redireciona para /login se não autenticado */}
          <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/cursos" element={<DashboardCursos />} />
            <Route path="/dashboard/jogos" element={<DashboardJogos />} />
            <Route path="/dashboard/progresso" element={<DashboardProgresso />} />
            <Route path="/dashboard/perfil" element={<DashboardPerfil />} />
            <Route path="/dashboard/perfil/editar" element={<DashboardPerfilEditar />} />
            <Route path="/dashboard/configuracoes" element={<DashboardConfig />} />

            <Route path="/aula/:id" element={<Aula />} />
            <Route path="/jogos" element={<Jogos />} />
            <Route path="/jogos/:catId" element={<Categoria />} />
            <Route path="/jogos/:catId/:level/:stage" element={<Fase />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/cursos/:level" element={<NivelCurso />} />
            <Route path="/cursos/:level/capitulo/:chapterId" element={<Capitulo />} />
            <Route path="/cursos/:level/prueba" element={<Prueba />} />
            <Route path="/dele/:id" element={<DeleDetail />} />
          </Route>
          </Route>

          <Route path="/aula" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
  </ErrorBoundary>
  );
};


export default App;
