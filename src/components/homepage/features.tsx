import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookCheck,
  ChartPie,
  FolderSync,
  Goal,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Goal,
    title: "Identifică oportunități",
    description:
      "Descoperă rapid intervale libere și optimizează programările pentru a-ți crește eficiența.",
  },
  {
    icon: BookCheck,
    title: "Gestionează clienții",
    description:
      "Administrează cu ușurință lista de clienți, istoricul programărilor și preferințele acestora.",
  },
  {
    icon: ChartPie,
    title: "Statistici instant",
    description:
      "Vizualizează rapid statistici despre programări, clienți și activitatea ta pentru decizii mai bune.",
  },
  {
    icon: Users,
    title: "Comunicare eficientă",
    description:
      "Trimite notificări automate și reamintește clienților de programări direct din platformă.",
  },
  {
    icon: FolderSync,
    title: "Automatizează procesele",
    description:
      "Redu timpul pierdut cu sarcini repetitive prin automatizarea programărilor și confirmărilor.",
  },
  {
    icon: Zap,
    title: "Crește-ți afacerea",
    description:
      "Atrage mai mulți clienți și gestionează-ți activitatea eficient cu ajutorul platformei noastre moderne.",
  },
];

const Features = () => {
  return (
    <div
      id="features"
      className="max-w-(--breakpoint-xl) mx-auto w-full py-12 xs:py-20 px-6"
    >
      <h2 className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
        Funcționalități inteligente pentru programări eficiente
      </h2>
      <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col border rounded-xl overflow-hidden shadow-none"
          >
            <CardHeader>
              <feature.icon />
              <h4 className="mt-3! text-xl font-bold tracking-tight">
                {feature.title}
              </h4>
              <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                {feature.description}
              </p>
            </CardHeader>
            <CardContent className="mt-auto px-0 pb-0">
              <div className="bg-muted h-52 ml-6 rounded-tl-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
