import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import type { User } from '@/types/index';
import type { Travel, City, Hotel, Restaurant, Spot, FlyingTicket, HotelReservation, Transportations } from '@/types/travel';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaPlaneDeparture, FaBus, FaHotel, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaCity } from 'react-icons/fa';
import { FiArrowLeft, FiEdit2, FiMap, FiUserPlus, FiPlus } from 'react-icons/fi';
import FlyingTicketModal from '../../components/ui/FlyingTicketModal';
import HotelReservationModal from '../../components/ui/HotelReservationModal';
import TransportationsModal from '../../components/ui/TransportationsModal';
import { Button } from '@/components/ui/button';
import locationsData from '../../../jsons/locations.json';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trips',
        href: '/travels',
    },
    {
        title: 'Details',
        href: '#',
    },
];

interface PageProps {
    auth: {
        user: User;
    };
    travel: Travel & {
        cities?: (City & {
            hotels: Hotel[];
            restaurants: Restaurant[];
            spots: Spot[];
        })[];
        flying_tickets?: FlyingTicket[];
        hotel_reservations?: HotelReservation[];
        transportations?: Transportations[];
    };
    canEdit?: boolean;
}

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";

type TimelineItem = {
    type: string;
    description: string;
    time: string;
    location?: string;
};

export default function Show({ auth, travel, canEdit = false }: PageProps) {
    type Expense = { price?: number };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatEuro = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const duration = calculateDuration(travel.start_date, travel.end_date);
    const flight_expenses = travel.flying_tickets || [];
    const hotel_expenses = travel.hotel_reservations || [];
    const transportation_expenses = travel.transportations || [];
    const flightTotal = flight_expenses.reduce<number>((sum, fe) => sum + (Number(fe.price || 0)), 0);
    const hotelTotal = hotel_expenses.reduce<number>((sum, he) => sum + (Number(he.price || 0)), 0);
    const transportTotal = transportation_expenses.reduce<number>((sum, te) => sum + (Number(te.price || 0)), 0);
    const total_expenses = flightTotal + hotelTotal + transportTotal;
    const total_expenses_formatted = total_expenses > 0
        ? formatEuro(total_expenses)
        : 'No expenses registered yet';
    const timeline: TimelineItem[] = travel.timeline || generateHourlyTimeline(travel.start_date, travel.end_date);
    const cities = travel.cities;
    const [expandedCityIndex, setExpandedCityIndex] = useState<number | null>(null);
    const countryData = locationsData.find(location => location.country === travel.destination);
    const countryBanner = countryData?.banner;
    const [isFlyingTicketModalOpen, setFlyingTicketModalOpen] = useState(false);
    const [isHotelReservationModalOpen, setHotelReservationModalOpen] = useState(false);
    const [isTransportationModalOpen, setTransportationModalOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<{
        tickets: boolean;
        reservations: boolean;
        transportations: boolean;
    }>({
        tickets: false,
        reservations: false,
        transportations: false
    });


    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title={travel.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center mb-4 px-4">
                    <Link
                        href={route('travels.index')}
                        className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                        Back to All Trips
                    </Link>

                    {canEdit && (
                        <>
                            <Link
                                href={route('travels.edit', travel.id)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FiEdit2 className="h-5 w-5" />
                                Edit Trip Details
                            </Link>
                        </>
                    )}
                </div>

                {/* Hero Section */}
                <div className="relative rounded-b-3xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-800/50 to-orange-600/50 dark:from-gray-900/50 dark:to-gray-900/50 z-10"></div>

                    {travel.cover_image ? (
                        <div
                            className="w-full h-80 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('${travel.cover_image}')` }}
                            onError={(e) => {
                                e.currentTarget.style.backgroundImage = `url('${countryBanner}')`;
                            }}
                        />
                    ) : (
                        <div
                            className="w-full h-80 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('/${countryBanner}')` }}
                        />
                    )}

                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                        <div className="max-w-7xl mx-auto w-full">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                                {travel.title}
                            </h1>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg drop-shadow-md">
                                    {travel.description ? travel.description : (
                                        <span className="text-gray-400 dark:text-gray-500 italic">
                                            No description provided yet.
                                        </span>
                                    )}
                                </h2>
                            </div>

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
                        {/* Trip Dates Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaCalendarAlt className="text-red-500" />
                                    <h3 className="text-lg font-semibold">Trip Dates</h3>
                                </div>
                                <p className="text-2xl font-bold mb-1">{duration}</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {formatDate(travel.start_date)} → {formatDate(travel.end_date)}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Trip Buddies Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-blue-500" />
                                        <h3 className="text-lg font-semibold">Trip Buddies</h3>
                                    </div>
                                    {canEdit && (
                                        <Link href={route('travels.invite', travel.id)}>
                                            <Button size="sm" className="flex items-center gap-2">
                                                <FiUserPlus className="h-4 w-4" />
                                                Invite
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                                <p className="text-2xl font-bold mb-3">
                                    {travel.users.length} {travel.users.length === 1 ? 'person' : 'people'}
                                </p>
                                <div className="flex -space-x-2">
                                    {travel.users.map(user => (
                                        <div key={user.id} className="relative">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo ?? ""}
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
                                {travel.invites?.sent && travel.invites.sent.length > 0 && (
                                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {travel.invites?.sent?.filter(invite => invite.status === 'pending').length ?? 0} pending invite{(travel.invites?.sent?.filter(invite => invite.status === 'pending').length ?? 0) === 1 ? '' : 's'}
                                        </p>
                                        <Link href={route('travels.invites', travel.id)}>
                                            <Button variant="link" size="sm" className="p-0 h-auto">
                                                View all invites
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Expenses Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaMoneyBillWave className="text-green-500" />
                                    <h3 className="text-lg font-semibold">Your Travel Expenses</h3>
                                </div>
                                <div className="space-y-3">
                                    {/* Flight Expenses Summary */}
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Flight Tickets</p>
                                        <p className="font-medium">
                                            {travel.flying_tickets?.length ?
                                                `${formatEuro(travel.flying_tickets
                                                    .filter(ticket => ticket.user_id === auth.user.id)
                                                    .reduce((sum, ticket) => sum + (ticket.price || 0), 0))}`
                                                : '0 €'}
                                        </p>
                                    </div>

                                    {/* Hotel Expenses Summary */}
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Hotel Expenses</p>
                                        <p className="font-medium">
                                            {travel.hotel_reservations ?
                                                `${formatEuro(travel.hotel_reservations
                                                    .filter(reservation => reservation.user_id === auth.user.id)
                                                    .reduce((sum, reservation) => sum + (reservation.price || 0), 0))}`
                                                : '0 €'}
                                        </p>
                                    </div>

                                    {/* Transportation Summary */}
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Transportation</p>
                                        <p className="font-medium">
                                            {travel.transportations ?
                                                `${formatEuro(travel.transportations
                                                    .filter(transportation => transportation.user_id === auth.user.id)
                                                    .reduce((sum: number, transportation: Transportations) => sum + (transportation.price || 0), 0))}`
                                                : '0 €'}
                                        </p>
                                    </div>

                                    {/* Total */}
                                    <div className="pt-2 border-t dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Your Total</p>
                                        <p className="text-xl font-bold">
                                            {total_expenses_formatted}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Expandable Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Flight Tickets Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <FaPlaneDeparture className="text-blue-500" />
                                        <h3 className="text-lg font-semibold">Your Flight Tickets</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <Button onClick={() => setFlyingTicketModalOpen(true)} size="sm" className="flex items-center gap-2">
                                                <FiPlus className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedSection(prev => ({ ...prev, tickets: !prev.tickets }))}
                                        >
                                            {expandedSection.tickets ? 'Hide' : 'View'}
                                        </Button>
                                    </div>
                                </div>

                                {expandedSection.tickets ? (
                                    travel.flying_tickets?.filter(t => t.user_id === auth.user.id)?.length ? (
                                        travel.flying_tickets
                                            .filter(ticket => ticket.user_id === auth.user.id)
                                            .map(ticket => (
                                                <div key={ticket.id} className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <div className="flex justify-between">
                                                        <p className="font-medium">BOOKING REF: {ticket.ticket_number}</p>
                                                        <p className="text-green-600 dark:text-green-400">${ticket.price}</p>
                                                    </div>
                                                    <div className="mt-2 text-sm">
                                                        <p>
                                                            <span className="font-medium">Departure:</span> {formatDate(ticket.departure_date)} <br />
                                                            from {ticket.departure_airport}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Arrival:</span> {formatDate(ticket.arrival_date)} <br />
                                                            at {ticket.arrival_airport}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            Status: <span className="capitalize">{ticket.status}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            <p>No flight tickets added yet</p>
                                            {canEdit && (
                                                <Button
                                                    onClick={() => setFlyingTicketModalOpen(true)}
                                                    className="mt-2 flex items-center gap-2"
                                                    size="sm"
                                                >
                                                    <FiPlus className="h-4 w-4" />
                                                    Add Ticket
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {travel.flying_tickets?.filter(t => t.user_id === auth.user.id).length || 0} ticket(s)
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Reservations Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <FaHotel className="text-red-500" />
                                        <h3 className="text-lg font-semibold">Your Bookings</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <Button onClick={() => setHotelReservationModalOpen(true)} size="sm" className="flex items-center gap-2">
                                                <FiPlus className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedSection(prev => ({ ...prev, reservations: !prev.reservations }))}
                                        >
                                            {expandedSection.reservations ? 'Hide' : 'View'}
                                        </Button>
                                    </div>
                                </div>

                                {expandedSection.reservations ? (
                                    travel.hotel_reservations?.filter(r => r.user_id === auth.user.id)?.length ? (
                                        <div className="space-y-3">
                                            {travel.hotel_reservations
                                                .filter(r => r.user_id === auth.user.id)
                                                .map(reservation => (
                                                    reservation && (
                                                        <div key={reservation.id} className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                            <p className="font-medium">{reservation.hotel_name}</p>
                                                            <p className="text-green-600 dark:text-green-400">{reservation.price} €</p>
                                                            <div className="mt-2 text-sm">
                                                                <p>
                                                                    <span className="font-medium">Check-in:</span> {formatDate(reservation.check_in_date)}
                                                                </p>
                                                                <p>
                                                                    <span className="font-medium">Check-out:</span> {formatDate(reservation.check_out_date)}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    Room Type: <span className="capitalize">{reservation.room_type}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            <p>No hotels booked yet</p>
                                            {canEdit && (
                                                <Button
                                                    onClick={() => setHotelReservationModalOpen(true)}
                                                    className="mt-2 flex items-center gap-2"
                                                    size="sm"
                                                >
                                                    <FiPlus className="h-4 w-4" />
                                                    Add Hotel
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {travel.hotel_reservations?.filter(r => r.user_id === auth.user.id).length || 0} reservation(s)
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transportations Card */}
                        <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <FaBus className="text-green-500" />
                                        <h3 className="text-lg font-semibold">Your Transportations</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <Button onClick={() => setTransportationModalOpen(true)} size="sm" className="flex items-center gap-2">
                                                <FiPlus className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedSection(prev => ({ ...prev, transportations: !prev.transportations }))}
                                        >
                                            {expandedSection.transportations ? 'Hide' : 'View'}
                                        </Button>
                                    </div>
                                </div>

                                {expandedSection.transportations ? (
                                    travel.transportations?.filter(t => t.user_id === auth.user.id)?.length ? (
                                        <div className="space-y-3">
                                            {travel.transportations
                                                .filter(t => t.user_id === auth.user.id)
                                                .map(transportation => (
                                                    transportation && (
                                                        <div key={transportation.id} className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                            <div className="flex justify-between">
                                                                <p className="font-medium capitalize">{transportation.transportation_type}</p>
                                                                <p className="text-green-600 dark:text-green-400">{transportation.price} €</p>
                                                            </div>
                                                            <div className="mt-2 text-sm">
                                                                <p>
                                                                    <span className="font-medium">Departure:</span> {formatDate(transportation.departure_date)} at {transportation.departure_time}
                                                                </p>
                                                                <p>
                                                                    <span className="font-medium">Arrival:</span> {formatDate(transportation.arrival_date)} at {transportation.arrival_time}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    {transportation.departure_location} → {transportation.arrival_location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            <p>No transportations booked yet</p>
                                            {canEdit && (
                                                <Button
                                                    onClick={() => setTransportationModalOpen(true)}
                                                    className="mt-2 flex items-center gap-2"
                                                    size="sm"
                                                >
                                                    <FiPlus className="h-4 w-4" />
                                                    Add Transportation
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {travel.transportations?.filter(t => t.user_id === auth.user.id).length || 0} transportation(s)
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Map Section */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Trip Map</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-96 rounded-xl overflow-hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps/embed/v1/place?key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(travel.destination)}`}
                                            allowFullScreen
                                        >
                                        </iframe>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cities Section */}
                            <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
                                <CardHeader className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Cities</h2>
                                    {canEdit && (
                                        <Button size="sm" className="flex items-center gap-2">
                                            <FiPlus className="h-4 w-4" />
                                            Add City
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(cities ?? []).length > 0 ? (
                                            (cities ?? []).map((city, index) => (
                                                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{city.name}</h3>
                                                            <p className="text-gray-600 dark:text-gray-400">
                                                                {city.arrive_date ? formatDate(city.arrive_date) : 'N/A'} → {city.depart_date ? formatDate(city.depart_date) : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setExpandedCityIndex(expandedCityIndex === index ? null : index)}
                                                        >
                                                            {expandedCityIndex === index ? 'Hide Details' : 'View Details'}
                                                        </Button>
                                                    </div>
                                                    {expandedCityIndex === index && (
                                                        <div className="mt-2">
                                                            <p className="text-gray-700 dark:text-gray-300">Hotels:</p>
                                                            <ul>
                                                                {city.hotels?.map(hotel => (
                                                                    <li key={hotel.id}>{hotel.name}</li>
                                                                ))}
                                                            </ul>
                                                            <p className="text-gray-700 dark:text-gray-300">Restaurants:</p>
                                                            <ul>
                                                                {city.restaurants?.map(restaurant => (
                                                                    <li key={restaurant.id}>{restaurant.name}</li>
                                                                ))}
                                                            </ul>
                                                            <p className="text-gray-700 dark:text-gray-300">Spots:</p>
                                                            <ul>
                                                                {city.spots?.map(spot => (
                                                                    <li key={spot.id}>{spot.name}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <FiMap className="h-12 w-12 mx-auto mb-4" />
                                                <p>No cities added yet.</p>

                                            </div>
                                        )}
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
                                                item.type === 'bus' ? FaBus :
                                                    item.type === 'hotel' ? FaHotel :
                                                        item.type === 'city' ? FaCity : FaCalendarAlt;

                                            const bgColor = item.type === 'flight' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                item.type === 'bus' ? 'bg-green-100 dark:bg-green-900/30' :
                                                    item.type === 'hotel' ? 'bg-red-100 dark:bg-red-900/30' :
                                                        item.type === 'city' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                                            'bg-gray-100 dark:bg-gray-700';

                                            const iconColor = item.type === 'flight' ? 'text-blue-600 dark:text-blue-400' :
                                                item.type === 'bus' ? 'text-green-600 dark:text-green-400' :
                                                    item.type === 'hotel' ? 'text-red-600 dark:text-red-400' :
                                                        item.type === 'city' ? 'text-purple-600 dark:text-purple-400' :
                                                            'text-gray-600 dark:text-gray-400';

                                            return (
                                                <div key={index} className={`${bgColor} p-4 rounded-lg flex items-start gap-3`}>
                                                    <div className={`p-2 rounded-full ${iconColor.replace('text', 'bg')}/10 mt-1`}>
                                                        <Icon className={`h-5 w-5 ${iconColor}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="font-medium">{item.description}</p>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                {item.time}
                                                            </p>
                                                        </div>
                                                        {item.location && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <FaMapMarkerAlt className="inline mr-1" />
                                                                {item.location}
                                                            </p>
                                                        )}
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
                </div>
                {/* Flying Ticket Modal */}
                <FlyingTicketModal
                    isOpen={isFlyingTicketModalOpen}
                    onClose={() => setFlyingTicketModalOpen(false)}
                    travelId={travel.id}
                    userId={auth.user.id}
                    onSuccess={() => {
                        setFlyingTicketModalOpen(false);
                    }}
                />
                {/* Hotel Reservation Modal */}
                <HotelReservationModal
                    isOpen={isHotelReservationModalOpen}
                    onClose={() => setHotelReservationModalOpen(false)}
                    travelId={travel.id}
                    userId={auth.user.id}
                    onSuccess={() => {
                        setHotelReservationModalOpen(false);
                    }}
                />
                {/* Transportations Modal */}
                <TransportationsModal
                    isOpen={isTransportationModalOpen}
                    onClose={() => setTransportationModalOpen(false)}
                    travelId={travel.id}
                    userId={auth.user.id}
                    onSuccess={() => {
                        setTransportationModalOpen(false);
                    }}
                />
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
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

function generateHourlyTimeline(start_date: string, end_date: string): { type: string; description: string; time: string; location?: string; }[] {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const timeline: { type: string; description: string; time: string; location?: string; }[] = [];

    // First day: arrival
    timeline.push({
        type: 'flight',
        description: 'Flight to destination',
        time: '08:00 - 10:30',
        location: 'International Airport'
    });
    timeline.push({
        type: 'bus',
        description: 'Transfer to hotel',
        time: '11:00 - 11:45',
        location: 'City Center'
    });
    timeline.push({
        type: 'hotel',
        description: 'Check-in at hotel',
        time: '12:00 - 12:30',
        location: 'Grand Hotel'
    });
    timeline.push({
        type: 'city',
        description: 'Explore downtown',
        time: '14:00 - 18:00',
        location: 'Main Square'
    });

    // Middle days: generic activities
    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    while (current < end) {
        const dateStr = current.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        timeline.push({
            type: 'generic',
            description: `Day in ${dateStr}`,
            time: '09:00 - 18:00',
            location: 'Various locations'
        });
        current.setDate(current.getDate() + 1);
    }

    // Last day: return
    timeline.push({
        type: 'flight',
        description: 'Return flight',
        time: '16:00 - 18:30',
        location: 'International Airport'
    });

    return timeline;
}
