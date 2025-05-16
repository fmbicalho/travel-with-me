import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { UserIcon } from 'lucide-react';

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
    
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Invite a Friend</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Search for friends by their email address
                </p>
              </div>
    
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter friend's email"
                    className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!data.email.trim()}
                  >
                    Search
                  </button>
                </div>
              </form>
    
              {submitted && (
                <div className="space-y-4">
                  {foundUser ? (
                    <div className={`p-4 rounded-lg ${isFriend ? 'bg-green-50' : 'bg-white border'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{foundUser.name}</p>
                            <p className="text-sm text-gray-500">{foundUser.email}</p>
                          </div>
                        </div>
                        {isFriend ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Already Friends
                          </span>
                        ) : (
                          <Link
                            href={`/friend-invite/send/${foundUser.id}`}
                            method="post"
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded hover:opacity-90"
                            preserveScroll
                          >
                            Send Invite
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-800">No user found with that email address.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </AppLayout>
      )
    }
