import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type User } from '@/types/index';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Travels',
        href: '/travels',
    },
    {
        title: 'Create New Travel',
        href: '/travels/create',
    },
];

interface PageProps {
    auth: {
        user: User;
    };
}

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        description: '',
        cover_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('travels.store'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('cover_image', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Create New Travel" />

            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Plan Your Next Adventure
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-zinc-300">
                            Fill in the details to create your travel itinerary
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Cover Image */}
                                    <div>
                                        <Label htmlFor="cover_image" className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                                            Cover Image
                                        </Label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl">
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-500"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 dark:text-zinc-400">
                                                    <label
                                                        htmlFor="cover_image"
                                                        className="relative cursor-pointer bg-white dark:bg-zinc-800 rounded-md font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 focus-within:outline-none"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="cover_image"
                                                            name="cover_image"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-zinc-500">
                                                    PNG, JPG up to 2MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <Label htmlFor="title" className="block text-lg font-medium text-gray-900 dark:text-white">
                                            Trip Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-2 text-lg py-3"
                                            placeholder="e.g. Summer Europe Adventure"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <Label htmlFor="destination" className="block text-lg font-medium text-gray-900 dark:text-white">
                                            Destination
                                        </Label>
                                        <Input
                                            id="destination"
                                            value={data.destination}
                                            onChange={(e) => setData('destination', e.target.value)}
                                            className="mt-2 text-lg py-3"
                                            placeholder="e.g. Paris, France"
                                            required
                                        />
                                        {errors.destination && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.destination}
                                            </p>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="start_date" className="block text-lg font-medium text-gray-900 dark:text-white">
                                                Start Date
                                            </Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="mt-2 text-lg py-3"
                                                required
                                            />
                                            {errors.start_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="end_date" className="block text-lg font-medium text-gray-900 dark:text-white">
                                                End Date
                                            </Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="mt-2 text-lg py-3"
                                                required
                                            />
                                            {errors.end_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.end_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description" className="block text-lg font-medium text-gray-900 dark:text-white">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-2 text-lg min-h-[120px]"
                                            placeholder="Tell us about your trip..."
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                                    <Link
                                        href={route('travels.index')}
                                        className="inline-flex items-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm text-lg font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors duration-200"
                                    >
                                        Cancel
                                    </Link>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="text-lg py-3 px-8"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </span>
                                        ) : (
                                            'Create Travel'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}