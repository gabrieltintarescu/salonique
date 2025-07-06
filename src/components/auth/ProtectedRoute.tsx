import { AppRoutes } from "@/AppRouter";
import { PageLoader } from "@/components/animations/LoadingComponents";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  userType?: 'client' | 'professional';
  delay?: number; // Delay in milliseconds before checking auth
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  userType,
  delay = 0,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    if (delay > 0) {
      const timer = setTimeout(() => {
        checkAuth();
      }, delay);
      return () => clearTimeout(timer);
    } else {
      checkAuth();
    }


    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [delay]);

  if (loading) {
    return <PageLoader message="Verificăm autentificarea..." />;
  }

  // If auth is required but user is not logged in
  if (requireAuth && !session) {
    const redirectUrl = userType === 'professional'
      ? AppRoutes.PROFESSIONAL_LOGIN
      : AppRoutes.CLIENT_LOGIN;

    // Only include redirect parameter if we're not already on a login page
    // and if the current path is not already a login path to prevent infinite redirects
    const currentPath = location.pathname;
    const isLoginPage = currentPath === AppRoutes.CLIENT_LOGIN || currentPath === AppRoutes.PROFESSIONAL_LOGIN;

    if (isLoginPage) {
      // If we're already on a login page, just go to it without redirect params
      return <Navigate to={redirectUrl} replace />;
    }

    // Include current location as redirect parameter, but only the pathname to avoid growing URLs
    const currentUrl = location.pathname;

    return <Navigate
      to={`${redirectUrl}?redirectUrl=${encodeURIComponent(currentUrl)}`}
      replace
    />;
  }

  // If user is logged in but shouldn't be (e.g., on login pages)
  if (!requireAuth && session) {
    const defaultRedirect = AppRoutes.MY_APPOINTMENTS;
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
}