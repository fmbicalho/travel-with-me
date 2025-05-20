import { Head, Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import type { Travel, City, Hotel, Restaurant, Spot, Location } from '@/types/travel';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { FiPlus, FiMapPin, FiCalendar, FiCoffee, FiMap, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import locationsData from '../../../jsons/locations.json';
import { format } from 'date-fns';

const locations: Location[] = locationsData;

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
        title: 'Edit',
        href: '#',
    },
];

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    travel: Travel & {
        cities?: (City & {
            hotels: Hotel[];
            restaurants: Restaurant[];
            spots: Spot[];
        })[];
    };
    isCreator: boolean;
}

export default function Edit({ auth, travel, isCreator }: Props) {
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [addingCity, setAddingCity] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string>(travel.destination);
    const [availableCities, setAvailableCities] = useState<{ name: string; banner: string }[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        title: travel.title,
        destination: travel.destination,
        start_date: travel.start_date,
        end_date: travel.end_date,
        description: travel.description || '',
        cover_image: null as File | null,
    });

    const cityForm = useForm({
        name: '',
        description: '',
        image: null as File | null,
        arrive_date: '',
        depart_date: '',
        banner: '',
    });

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM d, yyyy');
    };

    useEffect(() => {
        const countryData = locations.find((loc: Location) => loc.country === selectedCountry);
        const existingCityNames = travel.cities?.map(city => city.name) || [];
        const filteredCities = (countryData?.cities || []).filter(city =>
            !existingCityNames.includes(city.name)
        );
        setAvailableCities(filteredCities);
    }, [selectedCountry, travel.cities]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('travels.update', travel.id), {
            onSuccess: () => {
                toast.success('Travel updated successfully');
            },
        });
    };

    const handleAddCity = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCountry) {
            toast.error('Please select a country first');
            return;
        }

        // Validate required fields
        if (!cityForm.data.name || !cityForm.data.arrive_date || !cityForm.data.depart_date) {
            toast.error('Please fill all required fields');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('name', cityForm.data.name);
        formData.append('description', cityForm.data.description || '');
        formData.append('arrive_date', cityForm.data.arrive_date);
        formData.append('depart_date', cityForm.data.depart_date);
        if (cityForm.data.image) {
            formData.append('image', cityForm.data.image);
        }
        if (cityForm.data.banner) {
            formData.append('banner', cityForm.data.banner);
        }

        router.post(route('travels.cities.store', travel.id), formData, {
            onSuccess: () => {
                setAddingCity(false);
                cityForm.reset();
                toast.success('City added successfully');
                router.reload({ only: ['travel'] });
            },
            onError: (errors) => {
                toast.error('Failed to add city: ' + Object.values(errors).join(', '));
            },
            preserveScroll: true,
        });
    };

    const handleDeleteCity = (cityId: number) => {
        if (confirm('Are you sure you want to delete this city?')) {
            router.delete(route('cities.destroy', cityId), {
                onSuccess: () => {
                    toast.success('City deleted successfully');
                    router.visit(route('travels.edit', travel.id), { preserveScroll: true });
                },
            });
        }
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${travel.title}`} />

            <div className="py-12">
                <div className="flex items-center mb-4 justify-end mr-8">
                    <Link href={route('travels.show', travel.id)} className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors">
                        <FiArrowLeft className="h-5 w-5" />
                        Back to Travel Details
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Travel Details Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Travel Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        aria-invalid={!!errors.title}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="destination">Country</Label>
                                    <Select
                                        value={data.destination}
                                        onValueChange={(value) => {
                                            setData('destination', value);
                                            setSelectedCountry(value);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location.country} value={location.country}>
                                                    {location.flag} {location.country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input
                                            type="date"
                                            id="start_date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            aria-invalid={!!errors.start_date}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            type="date"
                                            id="end_date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            aria-invalid={!!errors.end_date}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        aria-invalid={!!errors.description}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cover_image">Cover Image</Label>
                                    <Input
                                        type="file"
                                        id="cover_image"
                                        onChange={e => setData('cover_image', e.target.files?.[0] || null)}
                                        aria-invalid={!!errors.cover_image}
                                    />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Cities Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Cities</CardTitle>
                            <Dialog open={addingCity} onOpenChange={(open) => {
                                if (open && !selectedCountry) {
                                    toast.error('Please select a country first');
                                    return;
                                }
                                setAddingCity(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <FiPlus className="mr-2" />
                                        Add City
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New City in {selectedCountry}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddCity} className="space-y-4">
                                        <div>
                                            <Label htmlFor="city_name">City</Label>
                                            <Select
                                                value={cityForm.data.name}
                                                onValueChange={(value) => {
                                                    cityForm.setData('name', value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCities.length > 0 ? (
                                                        availableCities.map((city) => (
                                                            <SelectItem key={city.name} value={city.name}>
                                                                {city.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="" disabled>
                                                            {selectedCountry ?
                                                                `No more cities available for ${selectedCountry}` :
                                                                'Please select a country first'
                                                            }
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="arrive_date">Arrival Date</Label>
                                            <Input
                                                type="date"
                                                id="arrive_date"
                                                value={cityForm.data.arrive_date}
                                                onChange={e => cityForm.setData('arrive_date', e.target.value)}
                                                min={data.start_date}
                                                max={data.end_date}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="depart_date">Departure Date</Label>
                                            <Input
                                                type="date"
                                                id="depart_date"
                                                value={cityForm.data.depart_date}
                                                onChange={e => cityForm.setData('depart_date', e.target.value)}
                                                min={cityForm.data.arrive_date || data.start_date}
                                                max={data.end_date}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="city_description">Description</Label>
                                            <Textarea
                                                id="city_description"
                                                value={cityForm.data.description}
                                                onChange={e => cityForm.setData('description', e.target.value)}
                                                aria-invalid={!!cityForm.errors.description}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="city_image">Additional Image (Optional)</Label>
                                            <Input
                                                type="file"
                                                id="city_image"
                                                onChange={e => cityForm.setData('image', e.target.files?.[0] || null)}
                                                aria-invalid={!!cityForm.errors.image}
                                            />
                                        </div>

                                        <Button type="submit" disabled={cityForm.processing}>
                                            Add City
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {(travel.cities ?? []).length > 0 ? (
                                <div className="space-y-4">
                                    {(travel.cities ?? []).map(city => (
                                        <Card key={city.id} className="relative">
                                            <CardHeader className="flex flex-row items-start justify-between">
                                                <div>
                                                    <CardTitle>{city.name}</CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <FiCalendar className="h-4 w-4" />
                                                        <span>
                                                            {city.arrive_date ? formatDate(city.arrive_date) : 'N/A'} - {city.depart_date ? formatDate(city.depart_date) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('cities.edit', city.id)}>
                                                            <FiEdit2 className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteCity(city.id)}
                                                    >
                                                        <FiTrash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {city.description && (
                                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                        {city.description}
                                                    </p>
                                                )}

                                                {/* Hotels, Restaurants, Spots sections */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="font-medium flex items-center gap-2 mb-2">
                                                            <FiMapPin className="text-blue-500" />
                                                            Hotels ({city.hotels?.length || 0})
                                                        </h3>
                                                        {(city.hotels ?? []).length > 0 ? (
                                                            <ul className="space-y-2">
                                                                {(city.hotels ?? []).map(hotel => (
                                                                    <li key={hotel.id} className="text-sm">
                                                                        {hotel.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No hotels added</p>
                                                        )}
                                                    </div>

                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="font-medium flex items-center gap-2 mb-2">
                                                            <FiCoffee className="text-green-500" />
                                                            Restaurants ({city.restaurants?.length || 0})
                                                        </h3>
                                                        {(city.restaurants?.length ?? 0) > 0 ? (
                                                            <ul className="space-y-2">
                                                                {(city.restaurants ?? []).map(restaurant => (
                                                                    <li key={restaurant.id} className="text-sm">
                                                                        {restaurant.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No restaurants added</p>
                                                        )}
                                                    </div>

                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="font-medium flex items-center gap-2 mb-2">
                                                            <FiMap className="text-red-500" />
                                                            Spots ({city.spots?.length || 0})
                                                        </h3>
                                                        {(city.spots?.length ?? 0) > 0 ? (
                                                            <ul className="space-y-2">
                                                                {(city.spots ?? []).map(spot => (
                                                                    <li key={spot.id} className="text-sm">
                                                                        {spot.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No spots added</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FiMap className="h-12 w-12 mx-auto mb-4" />
                                    <p>No cities added yet.</p>
                                    <p className="mt-2">Add cities to create your travel itinerary.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}