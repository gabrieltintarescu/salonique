import { AppRoutes } from "@/AppRouter"
import { supabase } from "@/lib/supabase"
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

                // If client already exists, redirect to appointments
                if (existingClient) {
                    toast("Bine ai revenit!", {
                        description: "Contul tău este deja configurat."
                    })
                    navigate(AppRoutes.MY_APPOINTMENTS)
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

                // Success - redirect to appointments
                toast("Succes", {
                    description: "Contul a fost configurat cu succes! Bine ai venit!"
                })
                navigate(AppRoutes.MY_APPOINTMENTS)

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Toaster position="top-center" />
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="animate-spin mx-auto h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Configurăm contul tău
                        </h2>
                        <p className="text-gray-600">
                            Verificăm și configurăm contul tău Google...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Toaster position="top-center" />
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Eroare de configurare
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Încearcă din nou
                            </button>
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Înapoi la login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
