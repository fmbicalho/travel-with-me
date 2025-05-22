import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TransportationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    travelId: number;
    userId: number;
    onSuccess: () => void;
}

export default function TransportationsModal({ 
    isOpen, 
    onClose, 
    travelId, 
    userId, 
    onSuccess 
}: TransportationsModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: userId,
        travel_id: travelId,
        transportation_type: '',
        departure_date: '',
        arrival_date: '',
        departure_time: '',
        arrival_time: '',
        departure_location: '',
        arrival_location: '',
        comments: '',
        price: 0,
        status: 'confirmed',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('transportations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (errors) => {
                console.error('Error creating transportation:', errors);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Transportation</h2>
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
                    <Label htmlFor="transportation_type">Transportation Type</Label>
                    <Input type="text" id="transportation_type" name="transportation_type" value={data.transportation_type} onChange={(e) => setData('transportation_type', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="departure_date">Departure Date</Label>
                    <Input type="date" id="departure_date" name="departure_date" value={data.departure_date} onChange={(e) => setData('departure_date', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="arrival_date">Arrival Date</Label>
                    <Input type="date" id="arrival_date" name="arrival_date" value={data.arrival_date} onChange={(e) => setData('arrival_date', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="departure_time">Departure Time</Label>
                    <Input type="time" id="departure_time" name="departure_time" value={data.departure_time} onChange={(e) => setData('departure_time', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="arrival_time">Arrival Time</Label>
                    <Input type="time" id="arrival_time" name="arrival_time" value={data.arrival_time} onChange={(e) => setData('arrival_time', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="departure_location">Departure Location</Label>
                    <Input type="text" id="departure_location" name="departure_location" value={data.departure_location} onChange={(e) => setData('departure_location', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="arrival_location">Arrival Location</Label>
                    <Input type="text" id="arrival_location" name="arrival_location" value={data.arrival_location} onChange={(e) => setData('arrival_location', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input type="text" id="comments" name="comments" value={data.comments} onChange={(e) => setData('comments', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input type="number" id="price" name="price" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} />
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
