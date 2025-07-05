
import { AppRoutes } from "@/AppRouter";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../homepage/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../homepage/ui/sheet";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Drawer</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu />

        <div className="mt-8 space-y-4">
          <Link to={AppRoutes.PROFESSIONAL_LOGIN}>
            <Button variant="outline" className="w-full sm:hidden">
              Conectare profesioniști
            </Button>
          </Link>
          <div className="h-1 xs:h-8" />
          <Link to={AppRoutes.CLIENT_LOGIN}>
            <Button className="w-full xs:hidden">Conectare clienți</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
