import MyAppointments from "@/pages/appointments/MyAppointments";
import RequestAppointment from "@/pages/appointments/RequestAppointment";
import ClientLogin from "@/pages/auth/ClientLogin";
import ClientRegister from "@/pages/auth/ClientRegister";
import ProfessionalLogin from "@/pages/auth/ProfessionalLogin";
import ProfessionalRegister from "@/pages/auth/ProfessionalRegister";
import ProfessionalDashboard from "@/pages/dashboard/ProfessionalDashboard";
import ClientProfile from "@/pages/profile/ClientProfile";
import EditProfile from "@/pages/profile/EditProfile";
import ProfessionalProfile from "@/pages/profile/ProfessionalProfile";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/client/login" />} />
                <Route path="/auth/client/login" element={<ClientLogin />} />
                <Route path="/auth/client/register" element={<ClientRegister />} />
                <Route path="/auth/professional/login" element={<ProfessionalLogin />} />
                <Route path="/auth/professional/register" element={<ProfessionalRegister />} />
                <Route path="/profile/professional" element={<ProfessionalProfile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/client" element={<ClientProfile />} />
                <Route path="/appointments" element={<MyAppointments />} />
                <Route path="/appointments/request" element={<RequestAppointment />} />
                <Route path="/dashboard" element={<ProfessionalDashboard />} />
            </Routes>
        </Router>
    );
}
