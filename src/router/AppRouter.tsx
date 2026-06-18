import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ClientesPage from "@/features/clientes/pages/ClientesPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="clientes"
            element={<ClientesPage />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
