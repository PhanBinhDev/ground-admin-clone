'use client'

import { ConfirmDialog } from '@/components/modals/confirm-dialog'
import useModal from '@/hooks/use-modal'
import { signOut } from '@/lib/auth/actions'
import { useTransition } from 'react'

export function ModalConfirmLogout() {
  const { isModalOpen, closeModal } = useModal()
  const [loading, startTransition] = useTransition()

  return (
    <ConfirmDialog
      open={isModalOpen('CONFIRM_LOGOUT')}
      onOpenChange={() => closeModal('CONFIRM_LOGOUT')}
      title="Uitloggen"
      description="Weet je zeker dat je wilt uitloggen uit Ground Control?"
      confirmLabel="Uitloggen"
      variant="destructive"
      loading={loading}
      onConfirm={() => {
        closeModal('CONFIRM_LOGOUT')
        startTransition(() => signOut())
      }}
    />
  )
}
