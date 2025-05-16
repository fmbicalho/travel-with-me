import AppLayout from '@/layouts/app-layout'
import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEvent, useState, useEffect } from 'react'
import type { BreadcrumbItem } from '@/types'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FiUpload, FiUser, FiMail, FiSave } from 'react-icons/fi'

interface User {
  id: number
  name: string
  email: string
  nickname: string | null
  photo: string | null
  photo_url: string | null
}

interface PageProps {
  user: User
  errors: {
    nickname?: string
    photo?: string
  }
  success?: string
  error?: string
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Profile', href: '/profile' },
]

export default function Profile({ user, errors: pageErrors, success, error }: PageProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
    reset,
  } = useForm({
    photo: null as File | null,
    nickname: user.nickname || '',
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('photo', file as File)
      setPreview(URL.createObjectURL(file))
    }
  }  

  const handlePhotoSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (data.photo) {
      post(route('profile.updatePhoto'), {
        forceFormData: true,
        onSuccess: () => {
          setPreview(null)
          setData('photo', null)
        },
      })
    }
  }

  const handleNicknameSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('profile.updateNickname'), {
      preserveScroll: true,
    })
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <AppLayout user={user} breadcrumbs={breadcrumbs}>
      <Head title="Profile" />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-black dark:text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo Card */}
          <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
            <CardHeader className="border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiUser className="text-red-500" />
                Profile Photo
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePhotoSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <img
                      src={preview || user.photo_url || '/default-avatar.png'}
                      alt="User photo"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 rounded-full p-2 text-white">
                        <FiUpload className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={processing}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-red-100 file:text-red-700 dark:file:bg-red-900/50 dark:file:text-red-300
                          hover:file:bg-red-200 dark:hover:file:bg-red-800
                          transition-colors cursor-pointer"
                      />
                    </label>
                    
                    {formErrors.photo && (
                      <p className="text-sm text-red-600 dark:text-red-400">{formErrors.photo}</p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={processing || !data.photo}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow hover:shadow-md"
                    >
                      <FiSave className="h-4 w-4" />
                      {processing ? 'Saving...' : 'Save Photo'}
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Profile Info Card */}
          <Card className="border-0 shadow-lg dark:shadow-none dark:bg-zinc-800/50 dark:border dark:border-gray-700">
            <CardHeader className="border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiUser className="text-red-500" />
                Profile Information
              </h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Nickname Form */}
              <form onSubmit={handleNicknameSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nickname
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={data.nickname}
                    onChange={(e) => setData('nickname', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-zinc-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Enter your nickname"
                  />
                  {formErrors.nickname && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.nickname}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow hover:shadow-md"
                >
                  <FiSave className="h-4 w-4" />
                  {processing ? 'Updating...' : 'Update Nickname'}
                </button>
              </form>

              {/* Read-only Info */}
              <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <p className="text-lg font-medium dark:text-white">{user.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <FiMail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-lg font-medium dark:text-white">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}