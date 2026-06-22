import { getCurrentProfile, getOsAdminRole } from '@/lib/auth/profile'
import { signOut } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function UnauthorizedPage() {
  const role = await getOsAdminRole()
  console.log('role', role)
  if (role) redirect('/')

  const profile = await getCurrentProfile()
  const email = profile?.email

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4'>
      <div className='space-y-2'>
        <h1 className='font-cinzel text-2xl text-copper tracking-widest uppercase'>
          Geen toegang
        </h1>
        <p className='text-muted-foreground text-sm max-w-sm'>
          {email ? (
            <>
              <span className='text-foreground'>{email}</span> heeft geen
              operatortoegang tot Ground Control.
            </>
          ) : (
            'Jouw account heeft geen operatortoegang tot Ground Control.'
          )}
        </p>
      </div>
      <form action={signOut}>
        <button
          type='submit'
          className='text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors'>
          Uitloggen en ander account gebruiken
        </button>
      </form>
    </div>
  )
}
