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
import { PageTransition } from "./components/animations/PageTransition";
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
                <Route path={AppRoutes.ROOT} element={
                    <PageTransition>
                        <Home />
                    </PageTransition>
                } />
                {/* Public routes that redirect if logged in */}
                <Route
                    path={AppRoutes.CLIENT_LOGIN}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <PageTransition>
                                <ClientLogin />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path={AppRoutes.CLIENT_REGISTER}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <PageTransition>
                                <ClientRegister />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path={AppRoutes.PROFESSIONAL_LOGIN}
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <PageTransition>
                                <ProfessionalLogin />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />

                {/* Protected routes */}
                <Route
                    path={AppRoutes.MY_APPOINTMENTS}
                    element={
                        <ProtectedRoute userType="client">
                            <PageTransition>
                                <MyAppointments />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path={AppRoutes.REQUEST_APPOINTMENT}
                    element={
                        <ProtectedRoute userType="client" delay={1000} >
                            <PageTransition>
                                <RequestAppointment />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path={AppRoutes.PROFESSIONAL_DASHBOARD}
                    element={
                        <ProtectedRoute userType="professional">
                            <PageTransition>
                                <ProfessionalDashboard />
                            </PageTransition>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path={AppRoutes.CLIENT_PROFILE}
                    element={
                        <ProtectedRoute userType="client">
                            <PageTransition>
                                <ClientProfile />
                            </PageTransition>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={
                    <PageTransition>
                        <NotFound />
                    </PageTransition>
                } />
                <Route path={AppRoutes.EMAIL_CONFIRMATION} element={
                    <PageTransition>
                        <EmailConfirmation />
                    </PageTransition>
                } />
                <Route path={AppRoutes.GOOGLE_ACCOUNT_SETUP} element={
                    <PageTransition>
                        <GoogleAccountSetup />
                    </PageTransition>
                } />
            </Routes>
        </Router >
    );
}