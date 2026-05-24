import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/user/DashboardPage";
import { AddSymptomsPage } from "./pages/user/AddSymptomsPage";
import { HistoryPage } from "./pages/user/HistoryPage";
import { AISuggestionPage } from "./pages/user/AISuggestionPage";
import { ProfilePage } from "./pages/user/ProfilePage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserMonitoringPage } from "./pages/admin/UserMonitoringPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { SevereCasesPage } from "./pages/admin/SevereCasesPage";
import { AlertsPage } from "./pages/admin/AlertsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "admin-login", Component: AdminLoginPage },
      { path: "signup", Component: SignupPage },
      { path: "forgot-password", Component: ForgotPasswordPage },
    ],
  },
  {
    path: "/user",
    Component: UserLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "add-symptoms", Component: AddSymptomsPage },
      { path: "history", Component: HistoryPage },
      { path: "ai-suggestions", Component: AISuggestionPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboardPage },
      { path: "monitoring", Component: UserMonitoringPage },
      { path: "severe-cases", Component: SevereCasesPage },
      { path: "alerts", Component: AlertsPage },
      { path: "reports", Component: ReportsPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
