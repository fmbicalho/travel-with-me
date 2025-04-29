import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import BG from '@/assets/intro.jpg';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=poppins:400,500,600,700" rel="stylesheet" />
            </Head>
            <div 
                className="flex min-h-svh items-center justify-center bg-cover bg-center p-6"
                style={{ backgroundImage: `url(${BG})` }}
            >
                <div className="w-full max-w-lg">
                    <div className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-xl rounded-2xl p-10 text-white">
                        <div className="flex flex-col items-center gap-6">
                            <Link href={route('home')} className="flex items-center gap-2">
                                <AppLogoIcon className="size-9 fill-current text-white" />
                                <h1 className="text-3xl font-bold">Travel With Me</h1>
                            </Link>

                            <p className="text-white/80 text-center">
                                Because traveling together is better.
                            </p>

                            <div className="w-full mt-8">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full block text-center rounded-lg border border-white/30 px-8 py-3 font-medium text-white hover:border-white/50 hover:bg-white/10 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link
                                            href={route('register')}
                                            className="w-full block text-center rounded-lg border border-white/30 px-8 py-3 font-medium text-white hover:border-white/50 hover:bg-white/10 transition-colors"
                                        >
                                            Start Your Journey
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="w-full block text-center rounded-lg border border-white/30 px-8 py-3 font-medium text-white hover:border-white/50 hover:bg-white/10 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}