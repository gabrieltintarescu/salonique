import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-(--breakpoint-xl) w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <Badge className="rounded-full py-1 border-none">
            Nou! V1.0.0
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.2]! tracking-tight">
            Soluția completă pentru gestionarea programărilor
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            Programează-te rapid și ușor, gestionează-ți clienții și optimizează-ți activitatea cu platforma noastră modernă de management al programărilor. Totul într-un singur loc, accesibil oricând!
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
            >
              Începe acum <ArrowUpRight className="h-5! w-5!" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none hidden"
            >
              <CirclePlay className="h-5! w-5!" /> Vezi demo
            </Button>
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
          <img
            src="/placeholder.svg"
            alt=""
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
