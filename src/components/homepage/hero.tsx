import { AppRoutes } from "@/AppRouter";
import { fadeIn, hoverScale, slideInLeft, slideInRight, tapScale } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { ArrowUpRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import hero_banner from '../../assets/home/salon.svg';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-(--breakpoint-xl) w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <motion.div
          className="max-w-xl"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Badge className="rounded-full py-1 border-none">
              Nou! V1.0.0
            </Badge>
          </motion.div>

          <motion.h1
            className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.2]! tracking-tight"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            Soluția completă pentru gestionarea programărilor
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[60ch] xs:text-lg"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            Programează-te rapid și ușor, gestionează-ți clienții și optimizează-ți activitatea cu platforma noastră modernă de management al programărilor. Totul într-un singur loc, accesibil oricând!
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full"
            variants={fadeIn}
            transition={{ delay: 0.8 }}
          >
            <Link to={AppRoutes.PROFESSIONAL_LOGIN} className="w-64 sm:w-auto">
              <motion.div
                whileHover={hoverScale}
                whileTap={tapScale}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base"
                >
                  Începe acum <ArrowUpRight className="h-5! w-5!" />
                </Button>
              </motion.div>
            </Link>
            <Link to={AppRoutes.CLIENT_LOGIN} className="w-64 sm:w-auto">
              <motion.div
                whileHover={hoverScale}
                whileTap={tapScale}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base shadow-none"
                >
                  <User className="h-5! w-5!" /> Conectare clienți
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative lg:max-w-lg xl:max-w-xl w-full"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src={hero_banner}
            alt=""
            className="object-cover rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
