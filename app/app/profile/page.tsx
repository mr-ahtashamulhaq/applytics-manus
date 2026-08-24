import { loadProfile } from '@/lib/actions/profile'
import ProfileForm from '@/components/profile/ProfileForm'

export const metadata = {
  title: 'Applytics',
  description: 'Manage your professional profile, skills, and experience.',
}

export default async function ProfilePage() {
  const initialData = await loadProfile()

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-label mb-1">Your Profile</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Profile
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)', maxWidth: '52ch' }}>
          This is the base we tailor from. The more complete your profile, the better your generated resumes.
        </p>
      </div>

      <ProfileForm initialData={initialData} />
    </div>
  )
}
