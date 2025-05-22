import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';

interface HotelReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    travelId: number;
    userId: number;
    onSuccess: () => void;
}

export default function HotelReservationModal({ 
    isOpen, 
    onClose, 
    travelId, 
    userId, 
    onSuccess 
}: HotelReservationModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        travel_id: travelId,
        user_id: userId,
        reservation_number: '',
        check_in_date: '',
        check_out_date: '',
        hotel_name: '',
        room_type: '',
        price: 0,
        status: 'confirmed'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hotel-reservations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (errors) => {
                console.error('Error creating reservation:', errors);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Hotel Reservation</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reservation_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reservation Number
                    </label>
                    <input
                        type="text"
                        id="reservation_number"
                        value={data.reservation_number}
                        onChange={(e) => setData({ ...data, reservation_number: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Check-In Date
                    </label>
                    <input
                        type="date"
                        id="check_in_date"
                        value={data.check_in_date}
                        onChange={(e) => setData({ ...data, check_in_date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Check-Out Date
                    </label>
                    <input
                        type="date"
                        id="check_out_date"
                        value={data.check_out_date}
                        onChange={(e) => setData({ ...data, check_out_date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="hotel_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hotel Name
                    </label>
                    <input
                        type="text"
                        id="hotel_name"
                        value={data.hotel_name}
                        onChange={(e) => setData({ ...data, hotel_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="room_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Room Type
                    </label>
                    <input
                        type="text"
                        id="room_type"
                        value={data.room_type}
                        onChange={(e) => setData({ ...data, room_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={data.price}
                        onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData({ ...data, status: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
