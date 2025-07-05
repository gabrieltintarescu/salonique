import { Link } from "react-router-dom";
import { Button } from "./Button";

export default function Navbar() {
    return (
        <nav className="w-full bg-white/90 backdrop-blur border-b border-neutral-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
            <Link to="/" className="font-bold text-2xl tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors select-none">Salonique<span className="text-neutral-400 font-normal">.com</span></Link>
            <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" className="text-neutral-700 hover:bg-neutral-100 font-medium px-5 py-2 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-colors" asChild>
                    <Link to="/appointments">Programări</Link>
                </Button>
                <Button type="button" variant="ghost" className="text-neutral-700 hover:bg-neutral-100 font-medium px-5 py-2 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-colors" asChild>
                    <Link to="/profile">Profil</Link>
                </Button>
                <Button type="button" variant="ghost" className="text-neutral-700 hover:bg-neutral-100 font-medium px-5 py-2 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-colors" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                </Button>
            </div>
        </nav>
    );
}
