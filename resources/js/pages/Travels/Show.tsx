import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaPlaneDeparture, FaBus, FaHotel, FaMapMarkerAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { FiArrowLeft, FiEdit2, FiCheckCircle } from 'react-icons/fi';

interface User {
    id: number;
    name: string;
    email: string;
    nickname: string;
    photo: string;
    travels: number;
    friends: number;
    totalUpdates: number;
    created_at: string;
}

interface Travel {
    id: number;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    description: string;
    users: User[];
    cover_image?: string;
    creator_id: number;
    duration?: string;
    flight_duration?: string;
    departure?: string;
    timeline?: {
        type: 'flight' | 'bus' | 'hotel';
        description: string;
        time: string;
    }[];
    todos?: {
        task: string;
        priority: 'low' | 'medium' | 'high';
    }[];
}

interface PageProps {
    auth: {
        user: User;
    };
    travel: Travel;
    canEdit?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
    {
        title: 'Details',
        href: '#',
    },
];

export default function Show({ auth, travel, canEdit = false }: PageProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate duration if not provided
    const duration = travel.duration || calculateDuration(travel.start_date, travel.end_date);
    const departure = travel.departure || "Unknown";
    const flightDuration = travel.flight_duration || "Unknown";

    // Default timeline if not provided
    const timeline = travel.timeline || [
        { type: "flight" as const, description: `${departure} → ${travel.destination}`, time: "08:00 - 09:15" },
        { type: "bus" as const, description: "Bus transfer", time: "09:30 - 10:00" },
        { type: "hotel" as const, description: "Check into a hotel", time: "10:00 - 10:40" }
    ];

    // Default todos if not provided
    const todos = travel.todos || [
        { task: "Book flights", priority: "high" as const },
        { task: "Reserve hotel", priority: "medium" as const },
        { task: "Plan itinerary", priority: "medium" as const }
    ];

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title={travel.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                {/* Hero Section */}
                <div className="relative rounded-b-3xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-800/70 to-orange-600/70 dark:from-gray-900/70 dark:to-gray-900/70 z-10"></div>

                    {travel.cover_image ? (
                        <div
                            className="w-full h-80 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('${travel.cover_image}')` }}
                        />
                    ) : (
                        <div className="w-full h-80 bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-24 w-24 text-white opacity-80"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    )}

                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                        <div className="max-w-7xl mx-auto w-full">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                                {travel.title}
                            </h1>

                            {travel.destination && (
                                <div className="flex items-center gap-3 mb-4">
                                    <FaMapMarkerAlt className="h-5 w-5 text-red-300" />
                                    <span className="text-xl font-semibold drop-shadow-md">
                                        {travel.destination}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaCalendarAlt className="text-red-500" />
                                    <h3 className="text-lg font-semibold">Travel Dates</h3>
                                </div>
                                <p className="text-2xl font-bold mb-1">{duration}</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {formatDate(travel.start_date)} - {formatDate(travel.end_date)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaUsers className="text-blue-500" />
                                    <h3 className="text-lg font-semibold">Travel Companions</h3>
                                </div>
                                <p className="text-2xl font-bold mb-3">
                                    {travel.users.length} {travel.users.length === 1 ? 'person' : 'people'}
                                </p>
                                <div className="flex -space-x-2">
                                    {travel.users.map(user => (
                                        <div key={user.id} className="relative">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                                                    alt={user.name}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = document.getElementById(`user-fallback-${user.id}`);
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                id={`user-fallback-${user.id}`}
                                                className={`w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white text-sm font-medium ${user.photo ? 'hidden' : 'flex'}`}
                                            >
                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaPlaneDeparture className="text-green-500" />
                                    <h3 className="text-lg font-semibold">Journey</h3>
                                </div>
                                <p className="text-2xl font-bold mb-1">{travel.destination}</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {departure} ➝ {travel.destination} · {flightDuration} flight
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Map Placeholder */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Trip Map</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 bg-gray-200 dark:bg-zinc-700 rounded-xl flex items-center justify-center">
                                        <span className="text-gray-500 dark:text-gray-400">Interactive map will appear here</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trip Details */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Trip Details</h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                        {travel.description || (
                                            <span className="text-gray-400 dark:text-gray-500 italic">
                                                No description provided yet.
                                            </span>
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* To Do List */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">To Do List</h2>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {todos.map((todo, index) => (
                                            <li key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
                                                    <span className="font-medium">{todo.task}</span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                                                    todo.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                                                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                }`}>
                                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="Add new task..."
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-zinc-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Timeline */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Timeline</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {timeline.map((item, index) => {
                                            const Icon = item.type === 'flight' ? FaPlaneDeparture :
                                                item.type === 'bus' ? FaBus : FaHotel;
                                            const bgColor = item.type === 'flight' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                item.type === 'bus' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
                                            const iconColor = item.type === 'flight' ? 'text-blue-600 dark:text-blue-400' :
                                                item.type === 'bus' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                                            return (
                                                <div key={index} className={`${bgColor} p-4 rounded-lg flex items-start gap-3`}>
                                                    <div className={`p-2 rounded-full ${iconColor.replace('text', 'bg')}/10 mt-1`}>
                                                        <Icon className={`h-5 w-5 ${iconColor}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.description}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.time}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Travel Companions */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FaUsers className="text-purple-500" />
                                        Travel Companions
                                    </h2>
                                </CardHeader>
                                <CardContent>
                                    {travel.users?.length > 0 ? (
                                        <ul className="space-y-3">
                                            {travel.users.map(user => (
                                                <li key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                    {user.photo ? (
                                                        <img
                                                            src={user.photo}
                                                            alt={user.name}
                                                            className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium">{user.name}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Traveler</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                            No travelers added yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-between items-center">
                        <Link
                            href={route('travels.index')}
                            className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                        >
                            <FiArrowLeft className="h-5 w-5" />
                            Back to All Travels
                        </Link>

                        {canEdit && (
                            <Link
                                href={route('travels.edit', travel.id)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FiEdit2 className="h-5 w-5" />
                                Edit Trip
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Helper function to calculate duration between dates
function calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}