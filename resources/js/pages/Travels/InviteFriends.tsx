import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type Travel, TravelInvite } from '../../types/travel';
import { type User } from '@/types/index';
import AppLayout from '../../layouts/app-layout';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import type { BreadcrumbItem } from '../../types/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
    {
        title: 'Details',
        href: '#',
    },
    {
        title: 'Invite Friends',
        href: '#',
    },
];

interface Props {
    auth: {
        user: User;
    };
    travel: Travel;
    friends: User[];
    pendingInvites: TravelInvite[];
}

interface FlashProps {
    success?: string;
    error?: string;
}

export default function InviteFriends({ 
    auth,
    travel, 
    friends = [], 
    pendingInvites = [], 
}: Props) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        travel_id: travel.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedFriend) {
            return;
        }
        
        setData({
            email: selectedFriend.email,
            travel_id: travel.id
        })
        
        post(route('travels.invites.store', travel.id), {
            onSuccess: () => {
                setSelectedFriend(null);
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Invite Friends" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Invites Section */}
                    {pendingInvites.length > 0 && (
                        <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                                    Pending Invites
                                </h2>
                                <div className="space-y-4">
                                    {pendingInvites.map((invite) => (
                                        <Card key={invite.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {invite.sender?.profile_photo_url ? (
                                                        <img
                                                            src={invite.sender.profile_photo_url}
                                                            alt={invite.sender?.name ?? 'Sender'}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                                            {invite.sender?.name ? invite.sender.name.charAt(0) : '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium dark:text-white">
                                                            {invite.email}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Invited by {invite.sender?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                    Pending
                                                </span>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Invite Friends Section */}
                    <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                                Invite Friends to {travel.title}
                            </h2>

                            {friends.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>No friends available to invite.</p>
                                    <p className="mt-2">They might already be part of this travel or you haven't added any friends yet.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        {friends.map((friend) => (
                                            <Card
                                                key={friend.id}
                                                className={`p-4 cursor-pointer transition-all ${
                                                    selectedFriend?.id === friend.id
                                                        ? 'ring-2 ring-red-500 dark:ring-red-400'
                                                        : 'hover:ring-1 hover:ring-red-200 dark:hover:ring-red-800'
                                                }`}
                                                onClick={() => setSelectedFriend(friend)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {typeof friend.photo === 'string' && friend.photo ? (
                                                        <img
                                                            src={friend.photo}
                                                            alt={friend.name}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                                            {friend.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium dark:text-white">{friend.name}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    {selectedFriend && (
                                        <form onSubmit={handleSubmit} className="space-y-6 mt-8 border-t pt-8 dark:border-gray-700">
                                            <div>
                                                <h3 className="text-lg font-medium dark:text-white">Selected Friend</h3>
                                                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        {typeof selectedFriend.photo === 'string' && selectedFriend.photo ? (
                                                            <img
                                                                src={selectedFriend.photo}
                                                                alt={selectedFriend.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                                                {selectedFriend.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium dark:text-white">{selectedFriend.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFriend.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <InputError message={errors.email} className="mt-2" />
                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-red-600 to-amber-600 text-white"
                                                >
                                                    {processing ? 'Sending...' : 'Send Invite'}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}