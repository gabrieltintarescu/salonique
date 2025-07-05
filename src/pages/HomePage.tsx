
import Navbar from "@/components/ui/Navbar";
import card_gestioneaza from '../assets/home/card_gestioneaza.svg';
import banner from '../assets/home/salon.svg';
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/card";

const features = [
    {
        title: "Gestionează programările ușor",
        description: "Programează, modifică sau anulează întâlniri rapid, fără bătăi de cap.",
        image: card_gestioneaza,
    },
    {
        title: "Notificări automate",
        description: "Primești notificări pentru fiecare programare, ca să nu uiți nimic important.",
        image: "/assets/notification.svg",
    },
    {
        title: "Securitate de top",
        description: "Datele tale sunt protejate cu cele mai noi tehnologii de securitate.",
        image: "/assets/security.svg",
    },
    {
        title: "Acces de oriunde",
        description: "Folosește platforma de pe orice dispozitiv, oricând ai nevoie.",
        image: "/assets/device.svg",
    },
    {
        title: "Interfață intuitivă",
        description: "Totul este la îndemână, cu un design minimalist și modern.",
        image: "/assets/ui.svg",
    },
    {
        title: "Suport dedicat",
        description: "Echipa noastră te ajută rapid pentru orice întrebare sau problemă.",
        image: "/assets/support.svg",
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center px-4 relative pt-8 md:pt-16">
                {/* Hero Section */}
                <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 py-20 md:py-28">
                    <div className="flex-1 flex flex-col items-start justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 text-left drop-shadow-sm">
                            Programările tale<br />într-un singur loc
                        </h1>
                        <p className="text-md text-neutral-600 mb-8 max-w-lg text-left">
                            Platforma modernă pentru gestionarea programărilor.<br />Simplu, rapid și sigur.
                        </p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <Button className="w-full">
                                <a href="/auth/ClientRegister">Înregistrează-te</a>
                            </Button>
                            <Button variant="outline" className="w-full">
                                <a href="/auth/ClientLogin">Autentificare</a>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <img
                            src={banner}
                            alt="Appointment banner"

                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-16 md:py-24">
                    {features.map((feature, idx) => (
                        <Card key={idx} className="flex flex-col items-center p-8 bg-white shadow-md border border-neutral-100">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-16 h-16 mb-4"
                                style={{ filter: 'drop-shadow(0 2px 8px #a3a3a3aa)' }}
                            />
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2 text-center">{feature.title}</h3>
                            <p className="text-neutral-600 text-center text-base">{feature.description}</p>
                        </Card>
                    ))}
                </section>

                {/* About Section */}
                <section className="w-full max-w-4xl mx-auto py-16 md:py-24 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 flex flex-col gap-4">
                        <h2 className="text-3xl font-bold text-neutral-900">De ce să alegi platforma noastră?</h2>
                        <ul className="list-disc pl-6 text-neutral-700 text-lg space-y-2">
                            <li>Totul este digital, fără hârtii sau telefoane inutile.</li>
                            <li>Ai control complet asupra programărilor tale.</li>
                            <li>Interfață minimalistă, rapidă și intuitivă.</li>
                            <li>Confidențialitate și siguranță pentru datele tale.</li>
                        </ul>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <img
                            src="/assets/calendar.svg"
                            alt="Calendar preview"
                            className="w-48 h-48 object-contain opacity-90"
                        />
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="w-full max-w-3xl mx-auto py-16 md:py-24 flex flex-col items-center gap-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 text-center">Începe acum să-ți organizezi timpul eficient!</h2>
                    <Button type="button" className="w-full md:w-auto px-10 py-4 text-lg font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-colors shadow-sm" asChild>
                        <a href="/auth/ClientRegister">Creează-ți cont gratuit</a>
                    </Button>
                </section>
            </main>
            <footer className="py-6 text-center text-neutral-400 text-sm mt-auto border-t border-neutral-100 bg-white/80">
                © {new Date().getFullYear()} Appointment Management. Toate drepturile rezervate.
            </footer>
        </div>
    );
}
