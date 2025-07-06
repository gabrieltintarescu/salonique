import { AppRoutes } from "@/AppRouter"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast, Toaster } from "sonner"
import login_banner from '../../assets/login_banner.webp'
import { Button } from "../ui/Button"

export function ProfessionalLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleSupabaseError } = useErrorHandler();


  // Email/password login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""

    if (!captchaToken) {
      toast("Oops!", {
        description: 'Te rugăm să completezi verificarea captcha.',
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken
      }
    })

    // Reset captcha after attempt
    captchaRef.current?.resetCaptcha()
    setCaptchaToken(null)

    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    if (error) {
      alert(error.message);
      toast("Oops!", {
        description: error.message,
        action: {
          label: "Ok",
          onClick: () => console.log("Ok"),
        },
      })
    } else {
      // Optionally redirect or reload
      window.location.reload()
    }
  }

  // Google login
  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    setLoading(false)
    if (error) {
      toast("Oops!", {
        description: error.message,
        action: {
          label: "Ok",
          onClick: () => console.log("Ok"),
        },
      })
    }
    // On success, Supabase will redirect
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster position="top-center" />
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bine ai revenit</h1>
                <p className="text-muted-foreground text-balance">
                  Autentifică-te în contul tău profesional.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@exemplu.com"
                  required ref={emailRef}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Parolă</Label>
                  <Link
                    to="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Ți-ai uitat parola?
                  </Link>
                </div>
                <Input id="password" type="password" required ref={passwordRef} />
              </div>

              {/* hCaptcha Component */}
              <div className="flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY || ""}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Se conectează...
                  </span>
                ) : (
                  "Concectează-te"
                )}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Sau continuă cu
                </span>
              </div>
              <Button variant="outline" className="w-full cursor-pointer" type="button" onClick={handleGoogleLogin} disabled={loading}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Conectează-te cu Google
              </Button>
              <div className="text-center text-sm hidden">
                Nu ai cont?{" "}
                <a href="#" className="underline underline-offset-4">
                  Creează cont
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={login_banner}
              alt="Imagine"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Continuând, ești de acord cu <a href="#">Termenii de utilizare</a>{" "}
        și <a href="#">Politica de confidențialitate</a>.
      </div>
    </div>
  )
}
