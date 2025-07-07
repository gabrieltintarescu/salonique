import { AppRoutes } from "@/AppRouter";
import { fadeIn, hoverScale } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../homepage/ui/button";
import { Logo } from "./logo";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "#avantaje", label: "Funcționalități" },
  { href: "#faq", label: "FAQ" },
  { href: "#recenzii", label: "Testimoniale" },
  { href: "#preturi", label: "Prețuri" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="h-20 bg-white/90 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50 shadow-sm"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
          {/* Logo */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Logo />
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden lg:flex items-center gap-8 xl:gap-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 btn-gradient transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </motion.nav>

          {/* Desktop Actions */}
          <motion.div
            className="hidden sm:flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={AppRoutes.PROFESSIONAL_LOGIN}>
              <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-full px-6 py-2.5 font-medium transition-all duration-200"
                >
                  Login Profesionist
                </Button>
              </motion.div>
            </Link>
            <Link to={AppRoutes.CLIENT_LOGIN}>
              <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
                <Button className="btn-gradient border-none rounded-full px-6 py-2.5 font-medium shadow-purple transition-all duration-200">
                  Începe gratuit
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <motion.div
            className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="px-6 py-8 space-y-6">
              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="block text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <Link
                  to={AppRoutes.PROFESSIONAL_LOGIN}
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full py-3 font-medium"
                  >
                    Login Profesionist
                  </Button>
                </Link>
                <Link
                  to={AppRoutes.CLIENT_LOGIN}
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full btn-gradient border-none rounded-full py-3 font-medium">
                    Începe gratuit
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
