import { fadeIn, hoverLift, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BookCheck,
  ChartPie,
  FolderSync,
  Goal,
  Users,
  Zap,
} from "lucide-react";
import card1 from '../../assets/home/card1.svg';
import card2 from '../../assets/home/card2.svg';
import card3 from '../../assets/home/card3.svg';
import card4 from '../../assets/home/card4.svg';
import card5 from '../../assets/home/card5.svg';
import card6 from '../../assets/home/card6.svg';


const features = [
  {
    icon: Goal,
    title: "Identifică oportunități",
    description:
      "Descoperă rapid intervale libere și optimizează programările pentru a-ți crește eficiența.",
    image: card1
  },
  {
    icon: BookCheck,
    title: "Gestionează clienții",
    description:
      "Administrează cu ușurință lista de clienți, istoricul programărilor și preferințele acestora.",
    image: card3
  },
  {
    icon: ChartPie,
    title: "Statistici instant",
    description:
      "Vizualizează rapid statistici despre programări, clienți și activitatea ta pentru decizii mai bune.",
    image: card2
  },
  {
    icon: Users,
    title: "Comunicare eficientă",
    description:
      "Trimite notificări automate și reamintește clienților de programări direct din platformă.",
    image: card4
  },
  {
    icon: FolderSync,
    title: "Automatizează procesele",
    description:
      "Redu timpul pierdut cu sarcini repetitive prin automatizarea programărilor și confirmărilor.",
    image: card5
  },
  {
    icon: Zap,
    title: "Crește-ți afacerea",
    description:
      "Atrage mai mulți clienți și gestionează-ți activitatea eficient cu ajutorul platformei noastre moderne.",
    image: card6
  },
];

const Features = () => {
  return (
    <motion.div
      id="avantaje"
      className="max-w-(--breakpoint-xl) mx-auto w-full py-12 xs:py-20 px-6"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2
        className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        Funcționalități inteligente pentru programări eficiente
      </motion.h2>
      <div className="h-8 xs:h-12" />
      <motion.div
        className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={staggerItem}
            custom={index}
          >
            <motion.div
              whileHover={hoverLift}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="flex flex-col border rounded-xl overflow-hidden shadow-none h-full">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <feature.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h4 className="mt-3! text-xl font-bold tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto px-0 pb-0">
                  <div className="bg-muted h-52 ml-6 rounded-tl-xl overflow-hidden">
                    <motion.img
                      src={feature.image}
                      alt=""
                      className="object-cover rounded-xl w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Features;
