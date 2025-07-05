import { AppRoutes } from "@/AppRouter";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  userType?: 'client' | 'professional';
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  userType,
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

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If auth is required but user is not logged in
  if (requireAuth && !session) {
    const redirectUrl = userType === 'professional'
      ? AppRoutes.PROFESSIONAL_LOGIN
      : AppRoutes.CLIENT_LOGIN;

    return <Navigate
      to={`${redirectUrl}`}
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