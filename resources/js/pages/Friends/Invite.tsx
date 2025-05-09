import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Friends', href: '/friends' },
    { title: 'Invite', href: '/friends/invite' },
];

interface InviteProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    existingFriendships: number[];
    foundUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export default function Invite({ user, foundUser = null, existingFriendships }: InviteProps) {
    const { data, setData, get } = useForm({ email: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        get(`/friends/invite?email=${data.email}`, {
          preserveScroll: true,
      });
      
    };

    const isFriend = foundUser && existingFriendships.includes(foundUser.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Invite Friends" />

            <div className="py-12 px-4 sm:px-0">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6">Invite a Friend</h1>

                    <form onSubmit={handleSearch} className="mb-6 space-y-4">
                        <input
                            type="email"
                            placeholder="Enter friend's email"
                            className="w-full p-3 border rounded"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>

                    {submitted && (
                        <>
                            {foundUser ? (
                                <div
                                    className={`p-4 rounded flex justify-between items-center ${
                                        isFriend
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-white border'
                                    }`}
                                >
                                    <span>{foundUser.name}</span>
                                    {isFriend ? (
                                        <span className="font-bold">Friends</span>
                                    ) : (
                                        <Link
                                            href={`/friend-invite/send/${foundUser.id}`}
                                            method="post"
                                            className="bg-gradient-to-r from-red-600 to-amber-600 text-white py-2 px-4 rounded-full shadow-lg"
                                        >
                                            Send Invite
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <p className="text-red-600">User not found.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
