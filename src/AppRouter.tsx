import MyAppointments from "@/pages/appointments/MyAppointments";
import RequestAppointment from "@/pages/appointments/RequestAppointment";
import ClientLogin from "@/pages/auth/ClientLogin";
import ClientRegister from "@/pages/auth/ClientRegister";
import EmailConfirmation from "@/pages/auth/EmailConfirmation";
import GoogleAccountSetup from "@/pages/auth/GoogleAccountSetup";
import ProfessionalLogin from "@/pages/auth/ProfessionalLogin";
import ProfessionalDashboard from "@/pages/dashboard/ProfessionalDashboard";
import NotFound from "@/pages/NotFound";
import ClientProfile from "@/pages/profile/ClientProfile";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/HomePage";

export const AppRoutes = {
    ROOT: "/",
    CLIENT_LOGIN: "/auth/client/login",
    EMAIL_CONFIRMATION: "/auth/confirm-email",
    CLIENT_REGISTER: "/auth/client/register",
    GOOGLE_ACCOUNT_SETUP: "/auth/google-setup",
    PROFESSIONAL_LOGIN: "/auth/professional/login",
    PROFESSIONAL_REGISTER: "/auth/professional/register",
    PROFESSIONAL_PROFILE: "/profile/professional",
    EDIT_PROFILE: "/profile/edit",
    CLIENT_PROFILE: "/profile/client",
    MY_APPOINTMENTS: "/appointments",
    REQUEST_APPOINTMENT: "/appointments/request",
    PROFESSIONAL_DASHBOARD: "/dashboard",
} as const;

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path={AppRoutes.ROOT} element={<Home />} />
                {/* Public routes that redirect if logged in */}
                <Route
                    path={AppRoutes.CLIENT_LOGIN}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <ClientLogin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoutes.CLIENT_REGISTER}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <ClientRegister />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoutes.PROFESSIONAL_LOGIN}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <ProfessionalLogin />
                        </ProtectedRoute>
                    }
                />

                {/* Protected routes */}
                <Route
                    path={AppRoutes.MY_APPOINTMENTS}
                    element={
                        <ProtectedRoute userType="client">
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoutes.REQUEST_APPOINTMENT}
                    element={
                        <ProtectedRoute userType="client" delay={1500} >
                            <RequestAppointment />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoutes.PROFESSIONAL_DASHBOARD}
                    element={
                        <ProtectedRoute userType="professional">
                            <ProfessionalDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoutes.CLIENT_PROFILE}
                    element={
                        <ProtectedRoute userType="client">
                            <ClientProfile />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
                <Route path={AppRoutes.EMAIL_CONFIRMATION} element={<EmailConfirmation />} />
                <Route path={AppRoutes.GOOGLE_ACCOUNT_SETUP} element={<GoogleAccountSetup />} />
            </Routes>
        </Router>
    );
}