import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { UserIcon, UserPlus, Clock, Check, X } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { formatDistanceToNow } from 'date-fns';

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
        email: string;
        photo?: string | null;
    }[];
    receivedInvites: {
        id: number;
        created_at: string;
        sender: {
            id: number;
            name: string;
            email: string;
            photo?: string | null;
        };
    }[];
    sentInvites: {
        id: number;
        created_at: string;
        receiver: {
            id: number;
            name: string;
            email: string;
            photo?: string | null;
        };
    }[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ user, friends, receivedInvites, sentInvites, flash }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Friends" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="p-4 mb-6 bg-green-50 text-green-800 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="p-4 mb-6 bg-red-50 text-red-800 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">Friends</span>
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                                {friends.length} {friends.length === 1 ? 'friend' : 'friends'} • 
                                {receivedInvites.length + sentInvites.length} pending
                            </p>
                        </div>
                        <Link
                            href="/friends/invite"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                        >
                            <UserPlus className="h-5 w-5" />
                            Invite New Friend
                        </Link>
                    </div>

                    {/* Received Invites Section */}
                    {receivedInvites.length > 0 && (
                        <section aria-labelledby="received-requests-heading">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="h-6 w-6 text-amber-500" />
                                <h2 id="received-requests-heading" className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    Friend Requests
                                </h2>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {receivedInvites.map((invite) => (
                                    <li key={invite.id} className="border rounded-xl p-4 bg-white dark:bg-zinc-800/50 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {invite.sender.photo ? (
                                                    <img 
                                                        src={invite.sender.photo} 
                                                        alt={invite.sender.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-white">{invite.sender.name} wants to be your friend!</p>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{invite.sender.email}</p>
                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                                        Request sent {formatDistanceToNow(new Date(invite.created_at))} ago
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/friends/invite/accept/${invite.id}`}
                                                    method="post"
                                                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    preserveScroll
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Accept
                                                </Link>
                                                <Link
                                                    href={`/friends/invite/reject/${invite.id}`}
                                                    method="post"
                                                    className="flex items-center gap-1 px-4 py-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                                    preserveScroll
                                                >
                                                    <X className="h-4 w-4" />
                                                    Decline
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Sent Invites Section */}
                    {sentInvites.length > 0 && (
                        <section aria-labelledby="sent-requests-heading">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="h-6 w-6 text-blue-500" />
                                <h2 id="sent-requests-heading" className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    Sent Requests
                                </h2>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sentInvites.map((invite) => (
                                    <li key={invite.id} className="border rounded-xl p-4 bg-white dark:bg-zinc-800/50 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {invite.receiver.photo ? (
                                                    <img 
                                                        src={invite.receiver.photo} 
                                                        alt={invite.receiver.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-white">{invite.receiver.name}</p>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{invite.receiver.email}</p>
                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                                        Friend request pending (since {formatDistanceToNow(new Date(invite.created_at))} ago)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Friends List Section */}
                    <section aria-labelledby="friends-list-heading">
                        <div className="flex items-center gap-3 mb-6">
                            <UserIcon className="h-6 w-6 text-blue-500" />
                            <h2 id="friends-list-heading" className="text-2xl font-bold text-zinc-900 dark:text-white">
                                Your Friends
                            </h2>
                        </div>
                        
                        {friends.length === 0 ? (
                            <div className="text-center py-12 rounded-xl bg-gradient-to-br from-white/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-800/10 border border-dashed border-zinc-300 dark:border-zinc-700">
                                <UserIcon className="h-12 w-12 mx-auto text-zinc-400 dark:text-zinc-500 mb-4" />
                                <p className="text-zinc-500 dark:text-zinc-400 mb-6">You don't have any friends yet.</p>
                                <Link
                                    href="/friends/invite"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Invite your first friend
                                </Link>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {friends.map(friend => (
                                    <li key={friend.id}>
                                        <Link 
                                            href={`/friends/${friend.id}`}
                                            className="group block h-full border rounded-xl p-5 bg-white dark:bg-zinc-800/50 dark:border-zinc-700 shadow-sm hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                {friend.photo ? (
                                                    <img 
                                                        src={friend.photo} 
                                                        alt={friend.name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white">
                                                        <UserIcon className="h-6 w-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-amber-500 transition-colors">
                                                        {friend.name}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                                        {friend.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    )
}