import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getNotifications } from '@/lib/queries'
import { AlertsContent } from './AlertsContent'

export default async function AlertasPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const notifications = await getNotifications(user.id)

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 max-w-lg mx-auto md:max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Alertas</h1>
        <p className="text-sm text-slate-500">
          Atualizações recentes dos seus parlamentares favoritos.
        </p>
      </div>

      <AlertsContent userId={user.id} initialNotifications={notifications} />
    </div>
  )
}
