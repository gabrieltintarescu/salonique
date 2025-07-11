import { ClientRegisterForm } from "@/components/auth/client-register-form";
import { Logo } from "@/components/navbar/logo";
import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";
import client_register_banner from '../../assets/register_client_banner.webp';

export default function ClientRegister() {
    return (
        <>
            <SEO {...seoConfigs.clientRegister} />
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <Logo />
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <ClientRegisterForm />
                        </div>
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src={(client_register_banner)}
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    )
}
