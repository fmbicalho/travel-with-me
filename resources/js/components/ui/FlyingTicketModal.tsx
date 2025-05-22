import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';

interface FlyingTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    travelId: number;
    userId: number;
    onSuccess: () => void;
}

export default function FlyingTicketModal({ 
    isOpen, 
    onClose, 
    travelId, 
    userId,
    onSuccess 
}: FlyingTicketModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        travel_id: travelId,
        user_id: userId,
        ticket_number: '',
        departure_date: '',
        arrival_date: '',
        departure_airport: '',
        arrival_airport: '',
        price: 0,
        status: 'confirmed'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('flying-tickets.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (errors) => {
                console.error('Error creating ticket:', errors);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Flight Ticket</h2>
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
                    <label htmlFor="ticket_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ticket Number
                    </label>
                    <input
                        type="text"
                        id="ticket_number"
                        name="ticket_number"
                        value={data.ticket_number}
                        onChange={(e) => setData('ticket_number', e.target.value)}
                        placeholder="ABC123"
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.ticket_number && <p className="text-red-500 text-sm mt-1">{errors.ticket_number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Departure Date
                        </label>
                        <input
                            type="date"
                            id="departure_date"
                            name="departure_date"
                            value={data.departure_date}
                            onChange={(e) => setData('departure_date', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.departure_date && <p className="text-red-500 text-sm mt-1">{errors.departure_date}</p>}
                    </div>
                    <div>
                        <label htmlFor="arrival_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Arrival Date
                        </label>
                        <input
                            type="date"
                            id="arrival_date"
                            name="arrival_date"
                            value={data.arrival_date}
                            onChange={(e) => setData('arrival_date', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.arrival_date && <p className="text-red-500 text-sm mt-1">{errors.arrival_date}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="departure_airport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Departure Airport
                        </label>
                        <input
                            type="text"
                            id="departure_airport"
                            name="departure_airport"
                            value={data.departure_airport}
                            onChange={(e) => setData('departure_airport', e.target.value)}
                            placeholder="JFK"
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.departure_airport && <p className="text-red-500 text-sm mt-1">{errors.departure_airport}</p>}
                    </div>
                    <div>
                        <label htmlFor="arrival_airport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Arrival Airport
                        </label>
                        <input
                            type="text"
                            id="arrival_airport"
                            name="arrival_airport"
                            value={data.arrival_airport}
                            onChange={(e) => setData('arrival_airport', e.target.value)}
                            placeholder="LAX"
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.arrival_airport && <p className="text-red-500 text-sm mt-1">{errors.arrival_airport}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price ($)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                            placeholder="0.00"
                            step="0.01"
                            required
                            className="w-full pl-8 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6"
                >
                    {processing ? 'Processing...' : 'Add Ticket'}
                </Button>
            </form>
        </Modal>
    );
}