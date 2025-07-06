import { AppRoutes } from "@/AppRouter"
import { fadeIn, slideUp } from "@/components/animations/PageTransition"
import { Logo } from "@/components/navbar/logo"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"

export default function GoogleAccountSetup() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleGoogleAuth = async () => {
            try {
                // Get current user from Supabase
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError || !user) {
                    setError("Nu s-a putut obține informații despre utilizator.")
                    toast("Eroare", {
                        description: "Nu s-a putut obține informații despre utilizator."
                    })
                    return
                }

                // Check if client already exists in database
                const { data: existingClient, error: clientError } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (clientError && clientError.code !== 'PGRST116') {
                    // PGRST116 is "not found" error, which is expected for new users
                    console.error('Error checking existing client:', clientError)
                    setError("A apărut o eroare la verificarea contului.")
                    toast("Eroare", {
                        description: "A apărut o eroare la verificarea contului."
                    })
                    return
                }

                // If client already exists, redirect to appropriate page
                if (existingClient) {
                    toast("Bine ai revenit!", {
                        description: "Contul tău este deja configurat."
                    })

                    // Check for stored redirect URL
                    const storedRedirect = sessionStorage.getItem('postAuthRedirect');
                    if (storedRedirect) {
                        sessionStorage.removeItem('postAuthRedirect');
                        navigate(storedRedirect);
                    } else {
                        navigate(AppRoutes.MY_APPOINTMENTS);
                    }
                    return
                }

                // Extract user information with fallbacks
                const userName = user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email?.split('@')[0] ||
                    'Utilizator Google'

                const userEmail = user.email || ''
                const userPhone = user.user_metadata?.phone || user.user_metadata?.phone_number || ''

                // Create new client record
                const { error: insertError } = await supabase
                    .from('clients')
                    .insert({
                        user_id: user.id,
                        name: userName,
                        email: userEmail,
                        phone: userPhone,
                        created_at: new Date().toISOString()
                    })

                if (insertError) {
                    console.error('Error creating client:', insertError)
                    setError("Nu s-a putut crea contul de client.")
                    toast("Eroare", {
                        description: "Nu s-a putut crea contul de client. Vă rugăm să contactați suportul."
                    })
                    return
                }

                // Success - redirect to appropriate page
                toast("Succes", {
                    description: "Contul a fost configurat cu succes! Bine ai venit!"
                })

                // Check for stored redirect URL
                const storedRedirect = sessionStorage.getItem('postAuthRedirect');
                if (storedRedirect) {
                    sessionStorage.removeItem('postAuthRedirect');
                    navigate(storedRedirect);
                } else {
                    navigate(AppRoutes.MY_APPOINTMENTS);
                }

            } catch (error) {
                console.error('Unexpected error:', error)
                setError("A apărut o eroare neașteptată.")
                toast("Eroare", {
                    description: "A apărut o eroare neașteptată."
                })
            } finally {
                setLoading(false)
            }
        }

        handleGoogleAuth()
    }, [navigate])

    const handleRetry = () => {
        setError(null)
        setLoading(true)
        window.location.reload()
    }

    const handleGoToLogin = () => {
        navigate(AppRoutes.CLIENT_LOGIN)
    }

    if (loading) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <Toaster position="top-center" />
                <motion.div
                    className="w-full max-w-sm"
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex flex-col gap-6">
                        <motion.div
                            className="flex justify-center"
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                        >
                            <Logo />
                        </motion.div>

                        <motion.div
                            className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-lg"
                            variants={fadeIn}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex flex-col items-center gap-4 text-center">
                                {/* Google icon with animation */}
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <svg
                                        className="h-8 w-8 text-primary animate-pulse"
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 48 48"
                                    >
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path>
                                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                                    </svg>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">Configurăm contul tău</h1>
                                    <p className="text-muted-foreground text-sm text-balance mt-2">
                                        Verificăm și configurăm contul tău Google...
                                    </p>
                                </div>

                                {/* Loading indicator */}
                                <div className="flex items-center justify-center gap-3 rounded-md bg-blue-50 p-4 border border-blue-200 w-full">
                                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span className="text-sm font-medium text-blue-800">Se configurează...</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <Toaster position="top-center" />
                <motion.div
                    className="w-full max-w-sm"
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex flex-col gap-6">
                        <motion.div
                            className="flex justify-center"
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                        >
                            <Logo />
                        </motion.div>

                        <motion.div
                            className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-lg"
                            variants={fadeIn}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex flex-col items-center gap-4 text-center">
                                {/* Error icon */}
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                    <svg
                                        className="h-8 w-8 text-destructive"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">Eroare de configurare</h1>
                                    <p className="text-muted-foreground text-sm text-balance mt-2">
                                        {error}
                                    </p>
                                </div>

                                {/* Error message */}
                                <div className="rounded-md bg-destructive/10 p-4 text-center w-full border border-destructive/20">
                                    <p className="text-sm font-medium text-destructive">
                                        A apărut o problemă la configurarea contului tău Google
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Button
                                        onClick={handleRetry}
                                        className="w-full"
                                    >
                                        Încearcă din nou
                                    </Button>
                                    <Button
                                        onClick={handleGoToLogin}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Înapoi la login
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return null
}
