import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface Message {
    id: number;
    content: string;
    sender_id: number;
    receiver_id: number;
    read_at: string | null;
    created_at: string;
    sender: {
        id: number;
        name: string;
        photo?: string;
    };
    receiver: {
        id: number;
        name: string;
        photo?: string;
    };
}

interface User {
    id: number;
    name: string;
    photo?: string;
    last_message?: string;
    last_message_time?: string;
    unread_count?: number;
}

interface Friendship {
    id: number;
    friend: User;
}

interface ConversationProps {
    messages: {
        data: Message[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
    };
    friend: User | null;
    friendships: Friendship[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            photo?: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
    {
        title: 'Conversation',
        href: '/messages/conversation',
    },
];

const formatTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
};

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
};

const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function Conversation() {
    const { messages, friend, friendships, auth } = usePage().props as unknown as ConversationProps;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages?.data || []);
    const [hasMore, setHasMore] = useState(messages?.links?.prev !== null);
    const [selectedFriend, setSelectedFriend] = useState<User | null>(friend);

    const { data, setData, post, reset, processing } = useForm({
        content: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMoreMessages = async () => {
        if (!hasMore || isLoading || !messages?.links?.prev) return;

        setIsLoading(true);
        try {
            const response = await fetch(messages.links.prev);
            const newMessages = await response.json();
            setLocalMessages((prev) => [...newMessages.data.reverse(), ...prev]);
            setHasMore(newMessages.links.prev !== null);
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFriend?.id) return;
        
        post(route('messages.store', selectedFriend.id), {
            onSuccess: () => {
                reset();
                scrollToBottom();
            },
            preserveScroll: true,
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    if (!friendships || friendships.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
                <Head title="No friends found" />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
                    <div className="text-center p-8 max-w-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No friends yet</h2>
                        <p className="text-gray-600 mb-6">
                            You need to add friends before you can start messaging.
                        </p>
                        <Button asChild>
                            <Link href="/friends">Find Friends</Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title={selectedFriend ? `Chat with ${selectedFriend.name}` : 'Messages'} />

            <div className="flex h-[calc(100vh-180px)] max-w-6xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
                {/* Friends List Sidebar */}
                <div className="w-80 border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Messages</h2>
                    </div>
                    <div className="flex-1">
                        <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {friendships.map((friendship) => (
                                <button
                                    key={friendship.id}
                                    className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-700/50 ${selectedFriend?.id === friendship.friend.id ? 'bg-gray-100 dark:bg-zinc-700' : ''}`}
                                    onClick={() => setSelectedFriend(friendship.friend)}
                                >
                                    <Avatar>
                                        <AvatarImage src={friendship.friend.photo} />
                                        <AvatarFallback>{getInitials(friendship.friend.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                {friendship.friend.name}
                                            </h3>
                                            {friendship.friend.last_message_time && (
                                                <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                    {formatDate(friendship.friend.last_message_time)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                                            {friendship.friend.last_message || 'No messages yet'}
                                        </p>
                                    </div>
                                    {friendship.friend.unread_count && friendship.friend.unread_count > 0 ? (
                                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {friendship.friend.unread_count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                {selectedFriend ? (
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={selectedFriend.photo} />
                                <AvatarFallback>{getInitials(selectedFriend.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {selectedFriend.name || 'Unknown user'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">
                                    {localMessages.length > 0 ? 'Last seen recently' : 'Start a new conversation'}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1">
                            <div className="p-4 space-y-4">
                                {hasMore && (
                                    <div className="flex justify-center">
                                        <Button
                                            variant="ghost"
                                            onClick={loadMoreMessages}
                                            disabled={isLoading}
                                            className="text-sm text-gray-500 dark:text-zinc-400"
                                        >
                                            {isLoading ? 'Loading...' : 'Load older messages'}
                                        </Button>
                                    </div>
                                )}

                                {localMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 text-gray-400 dark:text-zinc-500 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-zinc-300">
                                            No messages yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-zinc-400">
                                            Start the conversation with {selectedFriend.name || 'this user'}
                                        </p>
                                    </div>
                                ) : (
                                    localMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.sender_id === auth.user.id ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white'}`}
                                            >
                                                <div className="text-sm">{message.content}</div>
                                                <div
                                                    className={`text-xs mt-1 ${message.sender_id === auth.user.id ? 'text-red-100' : 'text-gray-500 dark:text-zinc-400'}`}
                                                >
                                                    {formatTime(message.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    type="text"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder={`Message ${selectedFriend.name || 'user'}...`}
                                    className="flex-1"
                                    disabled={processing}
                                />
                                <Button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
                                >
                                    Send
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-800">
                        <div className="text-center p-8 max-w-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-zinc-300">
                                Select a conversation
                            </h3>
                            <p className="text-gray-500 dark:text-zinc-400">
                                Choose a friend from the list to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}