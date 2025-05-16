import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/message',
    },
];

interface User {
    id: number;
    name: string;
    photo: string | null;
    last_message?: string;
    last_message_time?: string;
    unread_count?: number;
}

interface IndexProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    friends: User[];
}

export default function Index({ user, friends }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Chat" />

            <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">
                    <div className="flex h-full">
                        {/* Friends list */}
                        <div className="w-full md:w-96 border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex flex-col">
                            <div className="p-5 border-b border-gray-200 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {friends.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">No conversations yet</h3>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                                        {friends.map((friend) => (
                                            <li key={friend.id}>
                                                <Link
                                                    href={route('messages.show', friend.id)}
                                                    className="block p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0 relative">
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 flex items-center justify-center overflow-hidden">
                                                                {friend.photo ? (
                                                                    <img src={friend.photo} alt={friend.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <span className="text-white font-medium text-lg">
                                                                        {friend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {friend.unread_count && friend.unread_count > 0 && (
                                                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                                                    {friend.unread_count}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                                    {friend.name}
                                                                </p>
                                                                {friend.last_message_time && (
                                                                    <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
                                                                        {new Date(friend.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                                                                {friend.last_message || 'No messages yet'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Empty state */}
                        <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
                            <div className="text-center p-8 max-w-md">
                                <div className="mx-auto h-24 w-24 text-gray-300 dark:text-zinc-700 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Select a conversation</h3>
                                <p className="text-gray-500 dark:text-zinc-400 text-lg">
                                    Choose a friend from the list to start chatting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}