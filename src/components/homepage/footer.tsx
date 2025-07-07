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
    <footer className="xs:mt-20 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-(--breakpoint-xl) mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6">
        <div className="col-span-full xl:col-span-2">
          {/* Logo */}
          <Logo />

          <p className="mt-4 text-gray-600">
            Soluția modernă pentru gestionarea programărilor și clienților tăi. Simplu, rapid și eficient pentru orice afacere.
          </p>
        </div>

        {footerSections.map(({ title, links }) => (
          <div key={title} className="xl:justify-self-end">
            <h6 className="font-semibold text-gray-900">{title}</h6>
            <ul className="mt-6 space-y-4">
              {links.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    to={href}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator className="border-gray-200" />
      <div className="max-w-(--breakpoint-xl) mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        {/* Copyright */}
        <span className="text-gray-500 text-center xs:text-start">
          &copy; {new Date().getFullYear()} Salonique - Platformă de management programări. Toate drepturile rezervate.
        </span>

        <div className="flex items-center gap-5 text-gray-500">
          <Link to="#" target="_blank" className="hover:text-purple-600 transition-colors duration-200">
            <TwitterIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank" className="hover:text-purple-600 transition-colors duration-200">
            <DribbbleIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank" className="hover:text-purple-600 transition-colors duration-200">
            <TwitchIcon className="h-5 w-5" />
          </Link>
          <Link to="#" target="_blank" className="hover:text-purple-600 transition-colors duration-200">
            <GithubIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;