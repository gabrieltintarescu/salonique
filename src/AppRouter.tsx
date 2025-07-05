import MyAppointments from "@/pages/appointments/MyAppointments";
import RequestAppointment from "@/pages/appointments/RequestAppointment";
import ClientLogin from "@/pages/auth/ClientLogin";
import ClientRegister from "@/pages/auth/ClientRegister";
import ProfessionalLogin from "@/pages/auth/ProfessionalLogin";
import ProfessionalRegister from "@/pages/auth/ProfessionalRegister";
import ProfessionalDashboard from "@/pages/dashboard/ProfessionalDashboard";
import NotFound from "@/pages/NotFound";
import ClientProfile from "@/pages/profile/ClientProfile";
import EditProfile from "@/pages/profile/EditProfile";
import ProfessionalProfile from "@/pages/profile/ProfessionalProfile";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./app/page";

export const AppRoutes = {
    ROOT: "/",
    CLIENT_LOGIN: "/auth/client/login",
    CLIENT_REGISTER: "/auth/client/register",
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
                <Route path={AppRoutes.CLIENT_LOGIN} element={<ClientLogin />} />
                <Route path={AppRoutes.CLIENT_REGISTER} element={<ClientRegister />} />
                <Route path={AppRoutes.PROFESSIONAL_LOGIN} element={<ProfessionalLogin />} />
                <Route path={AppRoutes.PROFESSIONAL_REGISTER} element={<ProfessionalRegister />} />
                <Route path={AppRoutes.PROFESSIONAL_PROFILE} element={<ProfessionalProfile />} />
                <Route path={AppRoutes.EDIT_PROFILE} element={<EditProfile />} />
                <Route path={AppRoutes.CLIENT_PROFILE} element={<ClientProfile />} />
                <Route path={AppRoutes.MY_APPOINTMENTS} element={<MyAppointments />} />
                <Route path={AppRoutes.REQUEST_APPOINTMENT} element={<RequestAppointment />} />
                <Route path={AppRoutes.PROFESSIONAL_DASHBOARD} element={<ProfessionalDashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
