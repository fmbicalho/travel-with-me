export interface Travel {
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
    invites?: {
        sent: Array<{
            id: number;
            email: string;
            status: string;
            role: string;
            message?: string;
            sender?: User;
            recipient?: User;
        }>;
        received: Array<{
            id: number;
            email: string;
            status: string;
            role: string;
            message?: string;
            sender?: User;
            recipient?: User;
        }>;
    };
    cities?: City[];
    flight_expenses?: {
        id: number;
        travel_id: number;
        departure: string;
        arrival: string;
        departure_date: string;
        arrival_date: string;
        price: number;
        airline: string;
        flight_number: string;
        created_at: string;
        updated_at: string;
    };
    hotel_expenses?: {
        id: number;
        travel_id: number;
        city_id: number;
        hotel_id: number;
        check_in: string;
        check_out: string;
        price: number;
        hotel_name: string;
        hotel_address: string;
        hotel_phone: string;
        hotel_website: string;
        hotel_star_rating: number;
        hotel_picture: string;
        created_at: string;
        updated_at: string;
    }[];
    transportation_expenses?: {
        id: number;
        travel_id: number;
        city_id: number;
        type: 'bus' | 'train' | 'car';
        departure: string;
        arrival: string;
        departure_date: string;
        arrival_date: string;
        price: number;
        created_at: string;
        updated_at: string;
    }[];
}

export interface LocationCity {
    name: string;
    banner: string;
}

export interface Location {
    country: string;
    flag: string;
    banner: string;
    cities: LocationCity[];
}

export interface City {
    id: number;
    travel_id: number;
    name: string;
    description?: string;
    image?: string;
    arrive_date?: string;
    depart_date?: string;
    created_at: string;
    updated_at: string;
    hotels?: Hotel[];
    restaurants?: Restaurant[];
    spots?: Spot[];
}

export interface Hotel {
    id: number;
    city_id: number;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    price_range?: number;
    star_rating?: number;
    picture?: string;
    created_at: string;
    updated_at: string;
}

export interface Restaurant {
    id: number;
    city_id: number;
    name: string;
    address: string;
    cuisine_type?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    closing_hours?: string;
    picture?: string;
    created_at: string;
    updated_at: string;
}

export interface Spot {
    id: number;
    city_id: number;
    name: string;
    address: string;
    description?: string;
    entrance_fee?: number;
    opening_hours?: string;
    closing_hours?: string;
    type?: string;
    picture?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    photo: string;
}

export interface TravelInvite {
    id: number;
    travel_id: number;
    sender_id: number;
    email: string;
    token: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
    travel?: Travel;
    sender?: User;
}

export interface FlyingTicket {
    id: number;
    user_id: number;
    travel_id: number;
    ticket_number: string;
    departure_date: string;
    arrival_date: string;
    departure_airport: string;
    arrival_airport: string;
    price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface HotelReservation {
    id: number;
    user_id: number;
    travel_id: number;
    reservation_number: string;
    check_in_date: string;
    check_out_date: string;
    hotel_name: string;
    room_type: string;
    price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface Transportations {
    id: number;
    user_id: number;
    travel_id: number;
    transportation_type: string;
    departure_date: string;
    arrival_date: string;
    departure_time: string;
    arrival_time: string;
    departure_location: string;
    arrival_location: string;
    comments: string;
    price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}