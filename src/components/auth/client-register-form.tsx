import { AppRoutes } from "@/AppRouter"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { Button } from "../ui/Button"

export function ClientRegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  // Email/password register
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return // Previne trimiterea formularului dacă deja se încarcă
    setLoading(true)
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""
    const confirmPassword = confirmPasswordRef.current?.value || ""
    const name = nameRef.current?.value?.trim() || ""
    const phone = phoneRef.current?.value?.trim() || ""
    if (!name) {
      toast("Oops", {
        description: 'Numele este obligatoriu.',
      })
      setLoading(false)
      return
    }
    if (!phone) {
      toast("Oops", {
        description: 'Numărul de telefon este obligatoriu.',
      })
      setLoading(false)
      return
    }
    // Validare: doar cifre pentru telefon
    if (!/^[0-9+]+$/.test(phone)) {
      toast("Oops", {
        description: 'Numărul de telefon pare incorect.'
      })
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast("Oops", {
        description: 'Parolele nu coincid.'
      })
      setLoading(false)
      return
    }
    // Înregistrează utilizatorul
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${AppRoutes.EMAIL_CONFIRMATION}?email=${encodeURIComponent(email)}`,
        data: {
          name,
          phone,
        },
      },
    })
    if (error) {
      setLoading(false)
      toast("Oops", {
        description: error.message || "A apărut o eroare. Încearcă din nou."
      })
      return
    }
    // Adaugă clientul în tabela clients
    const user = data?.user
    if (user) {
      const { error } = await supabase.from('clients').insert({
        user_id: user.id,
        name,
        email,
        phone
      })
      if (error) {
        toast("Oops", {
          description: error.message || "Eroare la inregistrare.",
        });
        setLoading(false);
        return;
      }
    }
    setLoading(false)
    // a mers s-a creat contul și s-au salvat datele suplimentare
    navigate(`${AppRoutes.EMAIL_CONFIRMATION}?email=${encodeURIComponent(email)}`) // Redirecționează utilizatorul la pagina de confirmare email
  }

  // Google login
  const handleGoogleLogin = async () => {
    setLoading(true)
    // Google OAuth with redirect to our setup page
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${AppRoutes.GOOGLE_ACCOUNT_SETUP}`,
        queryParams: {
          prompt: 'select_account'
        }
      },
    })
    setLoading(false)
    if (error) {
      toast("Oops", {
        description: error.message || "A apărut o eroare. Încearcă din nou.",
      })
    }
    // The user will be redirected to Google and then back to our GoogleAccountSetup page
  }

  return (

    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <Toaster position="top-center" />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Creează-ți un cont nou</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Introdu datele tale mai jos pentru a te înregistra.
        </p>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="name">Nume</Label>
          <Input id="name" type="text" placeholder="Numele tău" required ref={nameRef} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="phone">Număr de telefon</Label>
          <Input id="phone" type="tel" placeholder="07xxxxxxxx" required ref={phoneRef} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="client@exemplu.com" required ref={emailRef} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Parolă</Label>
          <Input id="password" type="password" required ref={passwordRef} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="confirmPassword">Confirmă parola</Label>
          <Input id="confirmPassword" type="password" required ref={confirmPasswordRef} />
        </div>
        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Se înregistrează...
            </span>
          ) : (
            "Înregistrează-te"
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-2 mb-2">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Sau înregistrează-te cu
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer" type="button" onClick={handleGoogleLogin} disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Înregistrează-te cu Google
        </Button>
      </div>
      <div className="text-center text-sm mt-2">
        Ai deja un cont?{"   "}
        <Link to={AppRoutes.CLIENT_LOGIN}
          className="underline underline-offset-4">
          Conectează-te
        </Link>
      </div>
    </form>
  )
}
