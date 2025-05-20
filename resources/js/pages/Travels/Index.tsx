import AppLayout from '@/layouts/app-layout';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { type Travel as BaseTravel, TravelInvite } from '@/types/travel';
import { Head, Link } from '@inertiajs/react';
import { FiPlus, FiMapPin } from 'react-icons/fi';
import { FaCompass } from 'react-icons/fa';
import locationsData from '../../../jsons/locations.json';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
];

type Travel = BaseTravel & {
    creator?: {
        name: string;
        photo?: string;
    };
};

interface IndexProps {
    user: {
        id: number;
        name: string;
        email: string;
        photo: string;
    };
    travels: Travel[];
    pendingInvites: TravelInvite[];
}

export default function Index({ user, travels, pendingInvites }: IndexProps) {
    const maxItems = 9;
    const remaining = maxItems - travels.length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Travels" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Pending Invites Section */}
                    {pendingInvites.length > 0 && (
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                            Pending Travel Invites
                                        </h2>
                                        <p className="text-zinc-500 dark:text-zinc-400">
                                            You have {pendingInvites.length} pending {pendingInvites.length === 1 ? 'invitation' : 'invitations'}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('travels.pending-invites')}
                                        className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                    >
                                        View All
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {pendingInvites.slice(0, 3).map((invite) => (
                                        <div
                                            key={invite.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    {invite.sender?.photo ? (
                                                        <img
                                                            src={invite.sender.photo}
                                                            alt={invite.sender.name}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white font-bold">
                                                            {invite.sender?.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-zinc-900 dark:text-white">
                                                        {invite.travel?.title}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        Invited by {invite.sender?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('travels.pending-invites')}
                                                className="flex-shrink-0 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-sm hover:shadow transition-all duration-200"
                                            >
                                                Respond
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                                Your Travel Adventures
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
                            Explore, create, and relive your most memorable journeys
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                My Travels
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                {travels.length} {travels.length === 1 ? 'journey' : 'journeys'}
                            </p>
                        </div>
                        <Link
                            href={route('travels.create')}
                            className="w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-base sm:text-lg font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <FiPlus className="h-5 w-5" />
                            <span>Create New Travel</span>
                        </Link>
                    </div>

                    {/* Travels Grid */}
                    <div className="bg-transparent">
                        {travels.length === 0 ? (
                            <div className="text-center py-16 sm:py-20 rounded-3xl bg-gradient-to-br from-white/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-800/10 border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm">
                                <FaCompass className="h-16 w-16 mx-auto text-zinc-400 dark:text-zinc-500 mb-4" />
                                <h3 className="text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    No Travels Yet
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                                    Start your adventure by creating your first travel
                                </p>
                                <Link
                                    href={route('travels.create')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-medium py-2 px-6 rounded-full shadow transition-colors"
                                >
                                    <FiPlus className="h-4 w-4" />
                                    Create First Travel
                                </Link>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {travels.map((travel) => {
                                    // Debugging: Log the travel destination
                                    console.log("Travel Destination:", travel.destination);

                                    // Find the country banner based on the travel.destination
                                    const countryBanner = locationsData.find(location => {
                                        const countryName = location.country.trim().toLowerCase();
                                        const destinationName = travel.destination.trim().toLowerCase();

                                        // Debugging: Log the comparison
                                        console.log("Comparing:", countryName, "with", destinationName);

                                        return countryName === destinationName;
                                    })?.banner;

                                    // Debugging: Log the found banner
                                    console.log("Found Banner:", countryBanner);

                                    return (
                                        <li key={travel.id} className="group">
                                            <Link
                                                href={route('travels.show', travel.id)}
                                                className="block h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                                            >
                                                <div className="relative overflow-hidden aspect-[4/3]">
                                                    <img
                                                        src={travel.cover_image || countryBanner} // Use country banner if cover_image is not available
                                                        alt={travel.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                        <span className="text-white font-bold text-lg">
                                                            View Details →
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start gap-2 mb-3">
                                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
                                                            {travel.title}
                                                        </h3>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200 flex-shrink-0">
                                                            <FiMapPin className="h-3 w-3" />
                                                            {travel.destination}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 mb-4">
                                                        {travel.creator_id && travel.creator && (
                                                            <div className="flex items-center">
                                                                {travel.creator.photo ? (
                                                                    <img
                                                                        src={travel.creator.photo}
                                                                        alt={travel.creator.name}
                                                                        className="h-6 w-6 rounded-full"
                                                                    />
                                                                ) : (
                                                                    // Fallback to initials if no photo is available
                                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                                                                        {travel.creator.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                <p className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                                    Created by {travel.creator?.name}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}



                                {Array.from({ length: remaining }).map((_, i) => (
                                    <li key={`placeholder-${i}`} className="relative h-full min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-800/10 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center group">
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-zinc-900/10 dark:stroke-zinc-100/10" />
                                        <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-2 group-hover:scale-110 transition-transform">
                                                <FaCompass className="h-6 w-6" />
                                            </div>
                                            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                                Future adventure
                                            </span>
                                            <Link
                                                href={route('travels.create')}
                                                className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1"
                                            >
                                                <FiPlus className="h-3 w-3" />
                                                Add new travel
                                            </Link>
                                        </div>
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
