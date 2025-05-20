import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useRef, useState } from 'react';

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
}

interface Message {
    id: number;
    content: string;
    created_at: string;
    sender: User;
    receiver: User;
}

interface ShowProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    friend: User;
    messages: {
        data: Message[];
        links: any[];
    };
    friends: User[];
}

export default function Show({ user, friend, messages, friends }: ShowProps) {
    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const [showFriendsList, setShowFriendsList] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('messages.store', friend.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const toggleFriendsList = () => {
        setShowFriendsList(!showFriendsList);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title={`Chat with ${friend.name}`} />

            <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">
                    <div className="flex h-full">
                        {/* Friends list - hidden on mobile by default */}
                        <div className={`${showFriendsList ? 'block' : 'hidden'} md:block w-full md:w-96 border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex flex-col`}>
                            <div className="p-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
                                <button 
                                    onClick={toggleFriendsList}
                                    className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-gray-100 dark:scrollbar-track-zinc-900">
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
                                        {friends.map((f) => (
                                            <li key={f.id}>
                                                <Link
                                                    href={route('messages.show', f.id)}
                                                    className={`block p-4 transition-colors duration-200 ${f.id === friend.id ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                                    onClick={() => setShowFriendsList(false)}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 flex items-center justify-center overflow-hidden">
                                                            {f.photo ? (
                                                                <img src={f.photo} alt={f.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-white font-medium text-lg">
                                                                    {f.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                                {f.name}
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

                        {/* Conversation area */}
                        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
                            {/* Chat header with mobile menu button */}
                            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center space-x-4">
                                <button 
                                    onClick={toggleFriendsList}
                                    className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 flex items-center justify-center overflow-hidden">
                                    {friend.photo ? (
                                        <img src={friend.photo} alt={friend.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-white font-medium text-lg">
                                            {friend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {friend.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Messages with improved scroll */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-zinc-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-gray-100 dark:scrollbar-track-zinc-900">
                                <div className="pr-2">
                                    {messages.data.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 dark:text-zinc-300 mb-2">
                                                No messages yet
                                            </h3>
                                            <p className="text-gray-500 dark:text-zinc-500 text-lg">
                                                Start the conversation with {friend.name}
                                            </p>
                                        </div>
                                    ) : (
                                        messages.data.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender.id === user.id ? 'justify-end mb-2' : 'justify-start mb-2'}`}
                                            >
                                                <div
                                                    className={`max-w-xs md:max-w-md rounded-xl px-5 py-3 ${message.sender.id === user.id 
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                                                        : 'bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white'}`}
                                                >
                                                    <p className="text-base">{message.content}</p>
                                                    <p className={`text-xs mt-2 text-right ${message.sender.id === user.id ? 'text-red-100' : 'text-gray-500 dark:text-zinc-400'}`}>
                                                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input */}
                            <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                                <form onSubmit={handleSubmit} className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder={`Message ${friend.name}...`}
                                        className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 font-medium shadow-sm"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}