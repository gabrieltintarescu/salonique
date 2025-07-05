import { AppRoutes } from "@/AppRouter";
import { Link } from "react-router-dom";
import { Button } from "../homepage/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

export default function Navbar() {
  return (
    <nav className="h-16 bg-background border-b border-accent">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu />

        <div className="flex items-center gap-3">
          <Link to={AppRoutes.PROFESSIONAL_LOGIN}>
            <Button variant="outline" className="hidden sm:inline-flex">
              Conectează-te ca profesionist
            </Button>
          </Link>
          <Button className="hidden xs:inline-flex">Creează cont</Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};
