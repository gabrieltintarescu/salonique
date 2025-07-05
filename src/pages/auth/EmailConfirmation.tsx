import { AppRoutes } from "@/AppRouter";
import { Logo } from "@/components/navbar/logo";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function EmailConfirmation() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in and redirect
    useEffect(() => {
        const checkAuthState = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // User is already logged in, redirect to appointments page
                navigate(AppRoutes.ROOT)
            }
        }

        checkAuthState();
    }, [navigate])

    useEffect(() => {
        // Get email from URL params or localStorage if available
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        if (emailParam) {
            setEmail(emailParam);
        } else {
            // Check if there's a pending user session
            const getPendingUser = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    setEmail(session.user.email);
                }
            };
            getPendingUser();
        }

        // Listen for auth state changes to handle email confirmation
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
                toast("Succes!", {
                    description: "Email-ul tău a fost confirmat cu succes! Poți să te autentifici acum.",
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleResendEmail = async () => {
        if (!email) {
            toast("Eroare", {
                description: "Adresa de email nu este disponibilă. Te rugăm să te înregistrezi din nou.",
            });
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        setLoading(false);

        if (error) {
            toast("Eroare", {
                description: error.message || "Nu s-a putut retrimite email-ul de confirmare.",
            });
        } else {
            toast("Succes", {
                description: "Email-ul de confirmare a fost retrimis!",
            });
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <Toaster position="top-center" />
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Logo />
                    </div>

                    <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-lg">
                        <div className="flex flex-col items-center gap-4 text-center">
                            {/* Email icon */}
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <svg
                                    className="h-8 w-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold">Verifică-ți email-ul</h1>
                                <p className="text-muted-foreground text-sm text-balance mt-2">
                                    Am trimis un link de confirmare la adresa ta de email.
                                </p>
                            </div>
                        </div>

                        {email && (
                            <div className="rounded-md bg-muted p-4 text-center">
                                <p className="text-sm font-medium">Email trimis la:</p>
                                <p className="text-sm text-muted-foreground mt-1">{email}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="text-center text-sm text-muted-foreground">
                                <p>Dă click pe linkul din email pentru a-ți confirma contul și a putea accesa toate funcțiile platformei.</p>
                                <p className="mt-2">Nu ai primit email-ul? Verifică folderul de spam sau solicită unul nou mai jos.</p>
                            </div>

                            <Button
                                onClick={handleResendEmail}
                                variant="outline"
                                className="w-full cursor-pointer"
                                disabled={loading || !email}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Se trimite...
                                    </span>
                                ) : (
                                    "Retrimite email-ul de confirmare"
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                <Link
                                    to={AppRoutes.CLIENT_LOGIN}
                                    className="text-primary hover:underline"
                                >
                                    Înapoi la autentificare
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
