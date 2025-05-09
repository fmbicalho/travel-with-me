import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { FaPlaneDeparture, FaBus, FaHotel } from 'react-icons/fa';

interface User {
    id: number;
    name: string;
    email: string;
    photo?: string;
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

    // New fields for the dashboard
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

            <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
                {/* Header - Keeping your original hero but adapting to new style */}
                <div className="bg-orange-100 rounded-2xl p-6 flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm font-medium">Nearest trip</p>
                        <h1 className="text-4xl font-bold">{travel.destination}</h1>
                    </div>
                    {travel.cover_image ? (
                        <div className="w-40 h-28 bg-cover bg-no-repeat rounded-lg" style={{ backgroundImage: `url('${travel.cover_image}')` }} />
                    ) : (
                        <div className="w-40 h-28 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Travel date</p>
                            <p className="text-xl font-bold">{duration}</p>
                            <p className="text-sm">{formatDate(travel.start_date)} - {formatDate(travel.end_date)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">People</p>
                            <p className="text-xl font-bold">{travel.users.length} {travel.users.length === 1 ? 'person' : 'people'}</p>
                            <div className="flex gap-2 mt-2">
                                {travel.users.map(user => (
                                    user.photo ? (
                                        <img key={user.id} src={user.photo} className="w-6 h-6 rounded-full" alt={user.name} />
                                    ) : (
                                        <div key={user.id} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                    )
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="text-xl font-bold">{travel.destination}</p>
                            <p className="text-sm">{departure} ➝ {travel.destination} · {flightDuration} flight</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Map & To-do - Keeping your description */}
                    <div className="md:col-span-2">
                        <div className="h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                            <span className="text-gray-500">Map here</span>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow mb-6">
                            <h2 className="text-lg font-bold mb-2">Trip Details</h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                {travel.description || (
                                    <span className="text-gray-400 italic">
                                        No description provided yet.
                                    </span>
                                )}
                            </p>

                            <h2 className="text-lg font-bold mb-2">To do's</h2>
                            <ul className="space-y-3 mb-4">
                                {todos.map((todo, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{index + 1}. {todo.task}</span>
                                        <span className={`${
                                            todo.priority === 'high' ? 'bg-red-200 text-red-700' :
                                            todo.priority === 'medium' ? 'bg-orange-200 text-orange-700' :
                                            'bg-green-200 text-green-700'
                                        } text-xs px-2 py-1 rounded`}>
                                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <input 
                                    type="text" 
                                    placeholder="Add new task" 
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calendar & Timeline */}
                    <div>
                        <div className="bg-white rounded-xl p-4 shadow mb-4">
                            <h2 className="text-lg font-bold mb-2">Timeline</h2>
                            {/*
                            <Calendar 
                                mode="single" 
                                selected={new Date(travel.start_date)} 
                                className="rounded-md border"
                            />
                            */}
                        </div>

                        <div className="space-y-3 mb-6">
                            {timeline.map((item, index) => {
                                const Icon = item.type === 'flight' ? FaPlaneDeparture : 
                                            item.type === 'bus' ? FaBus : FaHotel;
                                const bgColor = item.type === 'flight' ? 'bg-blue-100' : 
                                                item.type === 'bus' ? 'bg-green-100' : 'bg-red-100';
                                const iconColor = item.type === 'flight' ? 'text-blue-600' : 
                                                item.type === 'bus' ? 'text-green-600' : 'text-red-600';
                                
                                return (
                                    <div key={index} className={`${bgColor} rounded-xl p-3 flex items-center gap-2`}>
                                        <Icon className={iconColor} />
                                        <span>{item.description} · {item.time}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Travel Companions - Keeping your original but compact */}
                        <div className="bg-white rounded-xl p-4 shadow">
                            <h2 className="text-lg font-bold mb-2">Travel Companions</h2>
                            {travel.users?.length > 0 ? (
                                <ul className="space-y-2">
                                    {travel.users.map(user => (
                                        <li key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            {user.photo ? (
                                                <img 
                                                    src={user.photo} 
                                                    alt={user.name}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-gray-900">{user.name}</h3>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No travelers added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center">
                    <Link
                        href={route('travels.index')}
                        className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to All Travels
                    </Link>
                    
                    {canEdit && (
                        <Link
                            href={route('travels.edit', travel.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all hover:shadow-md"
                        >
                            Edit Trip
                        </Link>
                    )}
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}