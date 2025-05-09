import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import BG from '@/assets/intro.jpg'; 

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div 
            className="flex min-h-svh items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${BG})` }}
        >
            <div className="w-full max-w-lg">
                <div className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-xl rounded-2xl p-10 text-white">
                    <Link href={route('home')} className="flex items-center gap-2 justify-center mb-6">
                        <div className="flex h-9 w-9 items-center justify-center">
                            <AppLogoIcon />
                        </div>
                    </Link>

                    <div className="flex flex-col gap-6">
                        <div>
                            <CardHeader className="text-center px-0 pt-0 pb-6">
                                <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
                                <CardDescription className="text-white/80">{description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 text-white">
                                {children}
                            </CardContent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}