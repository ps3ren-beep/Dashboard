import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from '@/contexts';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  DashboardPage,
  ObjetivosPage,
  CartoesPage,
  TransacoesPage,
  PerfilPage,
} from '@/pages';
import { ROUTES } from '@/constants/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-400 text-secondary-darker">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout />
  );
}

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.OBJETIVOS} element={<ObjetivosPage />} />
              <Route path={ROUTES.CARTOES} element={<CartoesPage />} />
              <Route path={ROUTES.TRANSACOES} element={<TransacoesPage />} />
              <Route path={ROUTES.PERFIL} element={<PerfilPage />} />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
