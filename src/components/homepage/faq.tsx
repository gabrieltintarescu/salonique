
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";

const faq = [
  {
    question: "Cum îmi pot crea un cont?",
    answer:
      "Apasă pe butonul de înregistrare și completează datele necesare. Vei primi un email de confirmare pentru activarea contului.",
  },
  {
    question: "Cum pot programa o întâlnire?",
    answer:
      "După autentificare, accesează secțiunea 'Programează' și selectează serviciul, data și ora dorite. Vei primi o confirmare pe email.",
  },
  {
    question: "Pot anula sau modifica o programare?",
    answer:
      "Da, poți anula sau modifica o programare din contul tău, la secțiunea 'Programările mele'. Vei primi o notificare cu modificarea efectuată.",
  },
  {
    question: "Cum primesc notificări despre programări?",
    answer:
      "Platforma trimite automat notificări pe email și/sau SMS înainte de fiecare programare, pentru a nu uita de întâlnire.",
  },
  {
    question: "Este platforma potrivită pentru afacerea mea?",
    answer:
      "Da! Platforma este ideală pentru saloane, clinici, cabinete sau orice afacere care lucrează cu programări.",
  },
  {
    question: "Cum pot contacta echipa de suport?",
    answer:
      "Ne poți scrie oricând la suport@platforma-ta.ro sau direct din secțiunea de contact din platformă. Suntem aici să te ajutăm!",
  },
];

const FAQ = () => {
  return (
    <div
      id="faq"
      className="w-full max-w-(--breakpoint-xl) mx-auto py-8 xs:py-16 px-6"
    >
      <h2 className="md:text-center text-3xl xs:text-4xl md:text-5xl leading-[1.15]! font-bold tracking-tighter">
        Întrebări frecvente
      </h2>
      <p className="mt-1.5 md:text-center xs:text-lg text-muted-foreground">
        Răspunsuri rapide la cele mai comune întrebări despre platforma de programări.
      </p>

      <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
        <Accordion
          type="single"
          collapsible
          className="mt-8 space-y-4 md:columns-2 gap-4"
        >
          {faq.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index}`}
              className="bg-accent py-1 px-4 rounded-xl border-none mt-0! mb-4! break-inside-avoid"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                    "text-start text-lg"
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-[15px]">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
