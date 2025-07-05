import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const plans = [
  {
    name: "Start",
    price: 149,
    description:
      "Ideal pentru profesioniști la început de drum. Gestionează până la 50 de programări pe lună și trimite notificări automate clienților.",
    features: [
      "Până la 50 programări/lună",
      "Notificări automate pe email",
      "Calendar integrat",
      "Gestionare clienți de bază",
      "Suport prin email",
    ],
    buttonText: "Începe cu Start",
  },
  {
    name: "Avansat",
    price: 299,
    isRecommended: true,
    description:
      "Pentru afaceri în creștere. Include programări nelimitate, SMS reminders și rapoarte detaliate.",
    features: [
      "Programări nelimitate",
      "Notificări pe email și SMS",
      "Rapoarte detaliate",
      "Gestionare avansată clienți",
      "Suport prioritar",
    ],
    buttonText: "Alege Avansat",
    isPopular: true,
  },
  {
    name: "Premium",
    price: 499,
    description:
      "Soluție completă pentru echipe mari sau saloane cu mai multe locații. Include funcții avansate de management și integrare cu website-ul.",
    features: [
      "Toate funcțiile Avansat",
      "Conturi multiple utilizatori",
      "Integrare website",
      "Asistență dedicată",
      "Personalizare platformă",
    ],
    buttonText: "Alege Premium",
  },
];

const Pricing = () => {
  return (
    <div id="preturi" className="max-w-(--breakpoint-lg) mx-auto py-12 xs:py-20 px-6">
      <h1 className="text-4xl xs:text-5xl font-bold text-center tracking-tight">
        Pachete și prețuri
      </h1>
      <div className="mt-8 xs:mt-14 grid grid-cols-1 lg:grid-cols-3 items-center gap-8 lg:gap-0">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative bg-accent/50 border p-7 rounded-xl lg:rounded-none lg:first:rounded-l-xl lg:last:rounded-r-xl",
              {
                "bg-background border-[2px] border-primary py-12 rounded-xl!":
                  plan.isPopular,
              }
            )}
          >
            {plan.isPopular && (
              <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                Most Popular
              </Badge>
            )}
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">{plan.price} lei</p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>
            <Separator className="my-6" />
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="w-full mt-6 rounded-full"
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
