import { Head, Link, router, useForm } from '@inertiajs/react';
import type { Travel, TravelInvite } from '../../types/travel';
import type { User } from '../../types/index';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '../../types/index';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
    {
        title: 'Pending Invites',
        href: '#',
    },
];

interface Props {
    auth: {
        user: User;
    };
    travel: Travel;
    invites: {
        sent: TravelInvite[];
        received: TravelInvite[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PendingInvites({ auth, invites, flash = { success: undefined, error: undefined } }: Props) {
    const [processingInvite, setProcessingInvite] = useState<string | null>(null);

    const handleAccept = (token: string) => {
        setProcessingInvite(token);
        router.post(route('travels.invites.accept', token), {}, {
            onFinish: () => setProcessingInvite(null),
            preserveScroll: true
        });
    };

    const handleDecline = (token: string) => {
        setProcessingInvite(token);
        router.post(route('travels.invites.decline', token), {}, {
            onFinish: () => setProcessingInvite(null),
            preserveScroll: true
        });
    };

    const handleCancel = (inviteId: number) => {
        setProcessingInvite(String(inviteId));
        router.delete(route('travels.invites.destroy', inviteId), {
            onFinish: () => setProcessingInvite(null),
            preserveScroll: true
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Pending Invites" />

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Received Invites */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Received Invites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {invites.received.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">No pending invites received</p>
                                ) : (
                                    <div className="space-y-4">
                                        {invites.received.map((invite: TravelInvite) => (
                                            <div
                                                key={invite.id}
                                                className="border dark:border-gray-700 rounded-lg p-4 space-y-4 bg-white dark:bg-zinc-800"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <Link
                                                            href={route('travels.show', invite.travel?.id)}
                                                            className="text-lg font-medium hover:text-red-600 dark:hover:text-red-400"
                                                        >
                                                            {invite.travel?.title}
                                                        </Link>
                                                        <div className="flex items-center space-x-2">
                                                            {invite.sender?.profile_photo_url ? (
                                                                <img
                                                                    src={invite.sender.profile_photo_url}
                                                                    alt={invite.sender.name}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs">
                                                                    {invite.sender?.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                                Invited by {invite.sender?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        Pending
                                                    </Badge>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleAccept(invite.token)}
                                                        disabled={processingInvite === invite.token}
                                                        className="bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-700 hover:to-amber-700"
                                                    >
                                                        {processingInvite === invite.token ? 'Accepting...' : 'Accept'}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDecline(invite.token)}
                                                        disabled={processingInvite === invite.token}
                                                        variant="outline"
                                                        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                                    >
                                                        {processingInvite === invite.token ? 'Declining...' : 'Decline'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sent Invites */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sent Invites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {invites.sent.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">No pending invites sent</p>
                                ) : (
                                    <div className="space-y-4">
                                        {invites.sent.map((invite: TravelInvite) => (
                                            <div
                                                key={invite.id}
                                                className="border dark:border-gray-700 rounded-lg p-4 space-y-4 bg-white dark:bg-zinc-800"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <p className="font-medium dark:text-white">
                                                            {invite.email}
                                                        </p>
                                                        <Link
                                                            href={route('travels.show', invite.travel?.id)}
                                                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                                                        >
                                                            {invite.travel?.title}
                                                        </Link>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            invite.status === 'pending'
                                                                ? 'default'
                                                                : invite.status === 'accepted'
                                                                ? 'secondary'
                                                                : 'destructive'
                                                        }
                                                        className="ml-2"
                                                    >
                                                        {invite.status}
                                                    </Badge>
                                                </div>

                                                {invite.status === 'pending' && (
                                                    <Button
                                                        onClick={() => handleCancel(invite.id)}
                                                        disabled={processingInvite === String(invite.id)}
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                    >
                                                        {processingInvite === String(invite.id) ? 'Canceling...' : 'Cancel Invite'}
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
