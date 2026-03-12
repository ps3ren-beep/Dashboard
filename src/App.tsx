import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  DashboardPage,
  ObjetivosPage,
  CartoesPage,
  TransacoesPage,
  PerfilPage,
} from '@/pages';
import { ROUTES } from '@/constants/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.OBJETIVOS} element={<ObjetivosPage />} />
          <Route path={ROUTES.CARTOES} element={<CartoesPage />} />
          <Route path={ROUTES.TRANSACOES} element={<TransacoesPage />} />
          <Route path={ROUTES.PERFIL} element={<PerfilPage />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
