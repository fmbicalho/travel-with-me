import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Friends',
        href: '/friends',
    },
];

interface IndexProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    friends: {
        id: number;
        name: string;
    }[];
    pendingInvites: {
        id: number;
        sender: {
            id: number;
            name: string;
        };
    }[];
}

export default function Index({ user, friends, pendingInvites }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Friends" />

            <div className="py-12 px-4 sm:px-0">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Your Friends
                    </h1>

                    {/* Pending Invites Section */}
                    {pendingInvites.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Pending Friend Requests
                            </h2>
                            <ul className="space-y-4">
                                {pendingInvites.map((invite) => (
                                    <li key={invite.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <span className="text-lg font-medium">{invite.sender.name}</span>
                                        <div className="space-x-4">
                                            <Link
                                                href={`/friend-invite/accept/${invite.id}`}
                                                method="post"
                                                className="bg-green-600 text-white py-2 px-4 rounded-full shadow-lg"
                                            >
                                                Accept
                                            </Link>
                                            <Link
                                                href={`/friend-invite/reject/${invite.id}`}
                                                method="post"
                                                className="bg-red-600 text-white py-2 px-4 rounded-full shadow-lg"
                                            >
                                                Reject
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Friends List
                        </h2>
                        <Link
                            href="/friends/invite"
                            className="bg-gradient-to-r from-red-600 to-amber-600 text-white py-3 px-6 rounded-full shadow-lg"
                        >
                            Invite New Friend
                        </Link>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {friends.length === 0 ? (
                            <p>No friends yet. Invite some!</p>
                        ) : (
                            friends.map(friend => (
                                <li key={friend.id} className="border rounded-lg p-4">
                                    <h3 className="text-xl font-bold">{friend.name}</h3>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
