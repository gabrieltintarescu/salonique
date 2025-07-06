import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../navbar/logo";
import { Separator } from "./ui/separator";

const footerSections = [
  {
    title: "Platformă",
    links: [
      { title: "Prezentare", href: "#" },
      { title: "Funcționalități", href: "#" },
    ],
  },
  {
    title: "Companie",
    links: [
      { title: "Despre noi", href: "#" },
      { title: "Cariere", href: "#" },

    ],
  },
  {
    title: "Resurse",
    links: [
      { title: "Blog", href: "#" },
      { title: "Newsletter", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { title: "LinkedIn", href: "#" },
      { title: "Facebook", href: "#" },

    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Termeni", href: "#" },
      { title: "Confidențialitate", href: "#" },

    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-12 xs:mt-20 dark bg-background border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6">
        <div className="col-span-full xl:col-span-2">
          {/* Logo */}
          <Logo />

          <p className="mt-4 text-muted-foreground">
            Soluția modernă pentru gestionarea programărilor și clienților tăi. Simplu, rapid și eficient pentru orice afacere.
          </p>
        </div>

        {footerSections.map(({ title, links }) => (
          <div key={title} className="xl:justify-self-end">
            <h6 className="font-semibold text-foreground">{title}</h6>
            <ul className="mt-6 space-y-4">
              {links.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    to={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="max-w-(--breakpoint-xl) mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        {/* Copyright */}
        <span className="text-muted-foreground text-center xs:text-start">
          &copy; {new Date().getFullYear()} Salonique - Platformă de management programări. Toate drepturile rezervate.
        </span>

        <div className="flex items-center gap-5 text-muted-foreground">
          <Link to="#" target="_blank">
            <TwitterIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank">
            <DribbbleIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank">
            <TwitchIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank">
            <GithubIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
