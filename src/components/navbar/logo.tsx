import { AppRoutes } from "@/AppRouter";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to={AppRoutes.ROOT}>
    <span className="text-3xl font-heading font-bold tracking-tight text-gradient select-none leading-tight">
      Salonique
    </span>
  </Link>
);
