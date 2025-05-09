import AppLayout from '@/layouts/app-layout';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PlaceHolder from '@/assets/placeholder.jpg';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
];

interface Travel {
    id: number;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    cover_image?: string;
    creator?: {
        id: number;
        name: string;
    };
    pending_invites?: User[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface IndexProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    travels: Travel[];
}

export default function Index({ user, travels }: IndexProps) {
    const maxItems = 9;
    const remaining = maxItems - travels.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Travels" />

            <div className="py-12 px-4 sm:px-0">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                            Your Travel Adventures
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                            Explore, create, and relive your most memorable journeys
                        </p>
                    </div>
                    

                    {/* Action Bar */}
                    <div className="mb-16 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                My Travels
                            </h2>
                            <p className="text-gray-500 dark:text-zinc-400">
                                {travels.length} {travels.length === 1 ? 'journey' : 'journeys'} documented
                            </p>
                        </div>
                        <Link
                            href={route('travels.create')}
                            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create New Travel
                        </Link>
                    </div>

                    {/* Travels Grid */}
                    <div className="bg-transparent">
                        {travels.length === 0 ? (
                            <div className="text-center py-20 rounded-3xl bg-gradient-to-br from-white/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-800/10 border border-gray-200 dark:border-zinc-700 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-zinc-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-700 dark:text-zinc-300 mb-2">No Travels Yet</h3>
                                <p className="text-gray-500 dark:text-zinc-400 mb-6">Start your adventure by creating your first travel</p>
                                <Link
                                    href={route('travels.create')}
                                    className="inline-block bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-medium py-2 px-6 rounded-full shadow transition-colors"
                                >
                                    Create First Travel
                                </Link>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {travels.map((travel) => (
                                    <li key={travel.id} className="group">
                                        <Link 
                                            href={route('travels.show', travel.id)} 
                                            className="block h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                                        >
                                            <div className="relative overflow-hidden h-48">
                                                <img
                                                    src={travel.cover_image || PlaceHolder}
                                                    alt={travel.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                    <span className="text-white font-bold text-lg">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                                                        {travel.title}
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                        {travel.destination}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-zinc-300 mb-3">
                                                    {new Date(travel.start_date).toLocaleDateString()} - {new Date(travel.end_date).toLocaleDateString()}
                                                </p>
                                                {travel.creator && (
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                                                            {travel.creator.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </div>
                                                        <p className="ml-2 text-xs text-gray-500 dark:text-zinc-400">
                                                            Created by {travel.creator.name}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                {Array.from({ length: remaining }).map((_, i) => (
                                    <li key={`placeholder-${i}`} className="relative h-full min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-800/10 border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center">
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                                        <span className="relative z-10 text-gray-400 dark:text-zinc-500 text-sm font-medium">
                                            Future adventure
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}