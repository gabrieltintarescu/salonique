import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="w-full bg-white shadow p-4 flex justify-between items-center mb-4">
            <div className="font-bold text-xl text-purple-700">Lash Scheduler</div>
            <div className="flex gap-4">
                <Link to="/appointments" className="text-gray-700 hover:text-purple-700">Appointments</Link>
                <Link to="/profile" className="text-gray-700 hover:text-purple-700">Profile</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-700">Dashboard</Link>
            </div>
        </nav>
    );
}
