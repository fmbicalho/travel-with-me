import AppLayout from '@/layouts/app-layout'
import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import type { BreadcrumbItem } from '@/types'

interface User {
  id: number
  name: string
  email: string
  nickname: string | null
  photo: string | null
}

interface PageProps {
  user: User
  errors: {
    nickname?: string
  }
  [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Profile', href: '/profile' },
]

export default function Profile() {
  const { user, errors } = usePage<PageProps>().props

  const [preview, setPreview] = useState<string | null>(null)

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm({
    photo: null as File | null,
    nickname: user.nickname || '',
  })

  const handlePhotoChange = (e: FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      setData('photo', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handlePhotoSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (data.photo) {
      post(route('profile.updatePhoto'), { forceFormData: true })
    }
  }

  const handleNicknameSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('profile.updateNickname'))
  }

  return (
    <AppLayout user={user} breadcrumbs={breadcrumbs}>
      <Head title="Perfil" />

      <div className="max-w-3xl mx-auto p-6 text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

        {/* Foto */}
        <form onSubmit={handlePhotoSubmit} className="mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user.photo ? `/${user.photo}` : '/default-avatar.png'}
              alt="User photo"
              className="w-32 h-32 rounded-full object-cover border"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={processing}
              />
              <button
                type="submit"
                disabled={processing || !data.photo}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Guardar Foto
              </button>
            </div>
          </div>
        </form>

        {/* Nickname */}
        <form onSubmit={handleNicknameSubmit} className="mb-6 space-y-2">
          <label className="block font-medium">Nickname:</label>
          <input
            type="text"
            value={data.nickname}
            onChange={(e) => setData('nickname', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {formErrors.nickname && (
            <p className="text-sm text-red-600">{formErrors.nickname}</p>
          )}
          <button
            type="submit"
            disabled={processing}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Atualizar Nickname
          </button>
        </form>

        {/* Outros dados */}
        <div className="space-y-2">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </AppLayout>
  )
}
