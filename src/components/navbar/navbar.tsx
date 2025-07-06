import { AppRoutes } from "@/AppRouter";
import { fadeIn } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../homepage/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

export default function Navbar() {
  return (
    <motion.nav
      className="h-16 bg-background border-b border-accent"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Logo />
        </motion.div>

        {/* Desktop Menu */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NavMenu />
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
      </div>
    </motion.nav>
  );
};
