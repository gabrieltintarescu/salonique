import { AppRoutes } from "@/AppRouter";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to={AppRoutes.ROOT}>
    <span style={{
      fontWeight: 'bold',
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
      fontFamily: 'inherit',
      color: 'var(--foreground, #111)',
      lineHeight: 1.1,
      userSelect: 'none',
      display: 'inline-block',
    }}>
      Salonique
    </span>
  </Link>
);
