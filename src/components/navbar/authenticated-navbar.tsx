import { AppRoutes } from "@/AppRouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/homepage/ui/avatar";
import { Button } from "@/components/homepage/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/homepage/ui/sheet";
import { supabase } from "@/lib/supabase";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Calendar, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "./logo";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    profile_image_url?: string;
}

export default function AuthenticatedNavbar() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<'client' | 'professional' | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate();




    const handleLogout = async () => {
        try {
            setIsSheetOpen(false);
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Eroare la deconectare');
            } else {
                toast.success('Te-ai deconectat cu succes');
                navigate(AppRoutes.ROOT);
            }
        } catch (error) {
            toast.error('Eroare neașteptată la deconectare');
        }
    };

    const getProfileRoute = () => {
        return userType === 'client' ? AppRoutes.CLIENT_PROFILE : AppRoutes.PROFESSIONAL_PROFILE;
    };

    const getDashboardRoute = () => {
        return userType === 'client' ? AppRoutes.MY_APPOINTMENTS : AppRoutes.PROFESSIONAL_DASHBOARD;
    };

    if (loading) {
        return (
            <nav className="h-16 bg-background border-b border-accent">
                <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
                    <Logo />
                    <div className="flex items-center gap-3">
                        <div className="animate-pulse bg-muted rounded-full h-8 w-8"></div>
                    </div>
                </div>
            </nav>
        );
    }

    if (!user) {
        return null; // Don't render navbar if user is not authenticated
    }

    return (
        <nav className="h-16 bg-background border-b border-accent sticky top-0 z-50">
            <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
                <Logo />

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to={getDashboardRoute()}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        {userType === 'client' ? 'Programările mele' : 'Dashboard'}
                    </Link>

                    <Link
                        to={getProfileRoute()}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <User className="w-4 h-4" />
                        Profil
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link to={getProfileRoute()} className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.profile_image_url} alt={user.name} />
                                <AvatarFallback>
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                        </Link>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden lg:inline">Deconectează-te</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <VisuallyHidden>
                            <SheetTitle>Menu navigare</SheetTitle>
                        </VisuallyHidden>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col h-full">
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-4 border-b">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={user.profile_image_url} alt={user.name} />
                                        <AvatarFallback>
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 p-4 space-y-4">
                                    <Link
                                        to={getDashboardRoute()}
                                        onClick={() => setIsSheetOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">
                                            {userType === 'client' ? 'Programările mele' : 'Dashboard'}
                                        </span>
                                    </Link>

                                    <Link
                                        to={getProfileRoute()}
                                        onClick={() => setIsSheetOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">Profil</span>
                                    </Link>
                                </div>

                                {/* Logout Button */}
                                <div className="p-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Deconectează-te
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
