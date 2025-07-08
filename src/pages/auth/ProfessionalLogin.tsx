import { ProfessionalLoginForm } from "@/components/auth/professional-login-form";
import { Logo } from "@/components/navbar/logo";

export default function ProfessionalLogin() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
                <Logo />
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <ProfessionalLoginForm />
            </div>
        </div>
    )
}
