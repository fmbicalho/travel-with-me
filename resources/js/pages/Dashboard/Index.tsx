import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        nickname: string;
        photo: string;
        travels: number;
        friends: number;
        totalUpdates: number;
        created_at: string;
    };
    metrics: {
        totalTravels: number;
        nextTravel?: string;
        totalDays: number;
        mostFrequentDestination?: string;
        travelsPerYear: Record<string, number>;
        lastMessages: {
            id: number;
            content: string;
            created_at: string;
            sender: {
                id: number;
                name: string;
                photo: string;
            };
        }[];
        appUpdates: {
            id: number;
            title: string;
            description: string;
            created_at: string;
        }[];
        closestTravel: {
            id?: number;
            title: string;
            destination?: string;
            startDate: string | null;
            endDate: string | null;
            countdown: number;
            cover_image?: string;
            updates: {
                id: number;
                title: string;
                description: string;
                created_at: string;
                creator: {
                    id: number;
                    name: string;
                    photo: string;
                };
            }[];
            topUpdaters: {
                user: {
                    id: number;
                    name: string;
                    photo: string;
                };
                update_count: number;
            }[];
        };
    };
}

export default function Dashboard({ user, metrics }: DashboardProps) {
    // Get unique last messages (one per friend)
    const uniqueLastMessages = metrics.lastMessages.reduce((acc, message) => {
        if (!acc.some(m => m.sender.id === message.sender.id)) {
            acc.push(message);
        }
        return acc;
    }, [] as typeof metrics.lastMessages).slice(0, 3);

    // Calculate days since account creation
    const daysSinceCreation = user.created_at 
    ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)): 0;

    // Format countdown days
    const formattedCountdown = metrics.closestTravel.countdown > 0 
        ? `${Math.floor(metrics.closestTravel.countdown)} ${metrics.closestTravel.countdown === 1 ? 'day' : 'days'} left`
        : '';

    return (
        <AppLayout user={user} breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Hero Banner Section */}
            <div className="relative h-48 bg-gradient-to-r from-red-600 to-purple-700 overflow-hidden rounded-b-lg">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2560')] bg-cover bg-center opacity-30 rounded-b-lg"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg mb-8 px-4">
                        Adventure Awaits, {user.nickname || user.name.split(' ')[0]}!
                    </h1>
                </div>
            </div>

            <div className="flex flex-col gap-8 px-4 sm:px-6 py-8 text-black dark:text-white max-w-7xl mx-auto w-full">

                {/* Top Cards Grid with Glass Morphism */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 -mt-16 relative z-20">

                    {/* Profile Status - Updated layout */}
                    <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                {user.photo ? (
                                    <img src={user.photo} className="h-24 w-24 rounded-full border-4 border-red-500 object-cover" alt="User profile" />
                                ) : (
                                    <div className="h-24 w-24 rounded-full border-4 border-red-500 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-neutral-600 dark:text-neutral-300">
                                            {user.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {user.travels}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-black dark:text-white">{user.name}</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
                            {user.nickname && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">@{user.nickname}</p>
                            )}

                            <div className="flex gap-4 mt-4">
                                <div className="bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        {user.friends > 0 ? `${user.friends} friends` : 'No Friends Yet 😢'}
                                    </p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {user.totalUpdates} updates
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route('profile')}
                                className="mt-4 inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline group"
                            >
                                View Profile
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Last Friend Messages - Updated to show unique friends */}
                    <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Recent Messages</h3>
                            <Link
                                href={route('messages.index')}
                                className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                            >
                                View All
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {uniqueLastMessages.length > 0 ? (
                                uniqueLastMessages.map((msg) => (
                                    <Link
                                        key={msg.id}
                                        href={route('messages.show', msg.sender.id)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 hover:bg-white/70 dark:hover:bg-neutral-700/50 transition-colors group"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={msg.sender.photo || `https://ui-avatars.com/api/?name=${msg.sender.name}&background=random`}
                                                className="h-10 w-10 rounded-full border-2 border-red-500/30 object-cover"
                                                alt={msg.sender.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {msg.sender.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                                                {msg.content}
                                            </p>
                                        </div>
                                        <div className="text-gray-400 dark:text-gray-500 group-hover:text-red-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400">No recent messages</p>
                                    <Link
                                        href={route('messages.index')}
                                        className="mt-2 inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Start a conversation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* App Updates */}
                    <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">What's New</h3>
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">Latest</span>
                        </div>
                        <ul className="space-y-3">
                            {metrics.appUpdates.length > 0 ? (
                                metrics.appUpdates.map((update) => (
                                    <li key={update.id} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-neutral-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-neutral-600/50 transition-colors">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium">{update.title}</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{update.description}</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{update.created_at}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                                    No recent updates
                                </li>
                            )}
                        </ul>
                        <Link
                            href={route('updates.index')}
                            className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            View Changelog
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Travel Stats Section */}
                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg opacity-80">Total Travels</p>
                                <p className="text-3xl font-bold">{metrics.totalTravels}</p>
                                {metrics.travelsPerYear && Object.keys(metrics.travelsPerYear).length > 0 && (
                                    <p className="text-sm opacity-80 mt-1">
                                        {Object.entries(metrics.travelsPerYear).map(([year, count]) => (
                                            <span key={year}>{year}: {count} </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg opacity-80">Days Traveling</p>
                                <p className="text-3xl font-bold">{Number(daysSinceCreation)}</p>
                                {metrics.nextTravel && (
                                    <p className="text-sm opacity-80 mt-1">Next: {metrics.nextTravel}</p>
                                )}
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg opacity-80">Favorite Destination</p>
                                <p className="text-3xl font-bold">{metrics.mostFrequentDestination || "None"}</p>
                                {metrics.closestTravel.destination && metrics.closestTravel.destination !== metrics.mostFrequentDestination && (
                                    <p className="text-sm opacity-80 mt-1">Next: {metrics.closestTravel.destination}</p>
                                )}
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closest Travel Section */}
                <div className="rounded-2xl bg-white dark:bg-neutral-800 p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-neutral-700 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                                {metrics.closestTravel.title}
                                {metrics.closestTravel.destination && (
                                    <span className="text-lg font-normal text-neutral-600 dark:text-neutral-300 ml-2">
                                        ({metrics.closestTravel.destination})
                                    </span>
                                )}
                            </h2>
                            {metrics.closestTravel.startDate && metrics.closestTravel.endDate && (
                                <p className="text-lg text-neutral-600 dark:text-neutral-300">
                                    {new Date(metrics.closestTravel.startDate).toLocaleDateString()} - {new Date(metrics.closestTravel.endDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        {formattedCountdown && (
                            <div className="bg-red-100 dark:bg-red-900/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                                <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                                    {formattedCountdown}
                                </p>
                            </div>
                        )}
                    </div>

                    {metrics.closestTravel.id ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="mb-4">
                                    {metrics.closestTravel.cover_image ? (
                                        <div className="w-full h-40 bg-cover bg-no-repeat rounded-lg mb-4" style={{ backgroundImage: `url('${metrics.closestTravel.cover_image}')` }} />
                                    ) : (
                                        <div className="w-full h-40 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                    </svg>
                                    Recent Updates
                                </h3>
                                {metrics.closestTravel.updates.length > 0 ? (
                                    <>
                                        <ul className="space-y-3">
                                            {metrics.closestTravel.updates.map((update) => (
                                                <li key={update.id} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-neutral-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-neutral-600/50 transition-colors">
                                                    <img
                                                        src={update.creator.photo || `https://ui-avatars.com/api/?name=${update.creator.name}&background=random`}
                                                        className="h-8 w-8 rounded-full border border-red-500/30 mt-1 flex-shrink-0"
                                                        alt={update.creator.name}
                                                    />
                                                    <div>
                                                        <p className="font-medium">{update.title}</p>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{update.description}</p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{update.created_at}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={route('travels.updates.index', metrics.closestTravel.id)}
                                            className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                        >
                                            See all updates
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                                        No updates yet
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                                    </svg>
                                    Top Contributors
                                </h3>
                                {metrics.closestTravel.topUpdaters.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {metrics.closestTravel.topUpdaters.map((updater, i) => (
                                            <Link
                                                key={updater.user.id}
                                                href={route('profile', updater.user.id)}
                                                className="flex flex-col items-center text-center p-3 bg-white/50 dark:bg-neutral-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-neutral-600/50 transition-colors"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={updater.user.photo || `https://ui-avatars.com/api/?name=${updater.user.name}&background=random`}
                                                        className="h-14 w-14 rounded-full border-2 border-red-500/50"
                                                        alt={updater.user.name}
                                                    />
                                                    {i === 0 && (
                                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold mt-2">{updater.user.name}</p>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">{updater.update_count} updates</p>
                                                <div className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                                                    Top {i + 1}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                                        No contributors yet
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                                You don't have any upcoming travels planned yet.
                            </p>
                            <Link
                                href={route('travels.create')}
                                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Plan Your Next Adventure
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}