'use client'

import { ModalConfirmLogout } from '@/components/modals/modal-confirm-logout'
import useModal from '@/hooks/use-modal'
import { useEffect, useState } from 'react'

export function ModalsProvider() {
  const { isModalOpen } = useModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      {isModalOpen('CONFIRM_LOGOUT') && <ModalConfirmLogout />}
    </>
  )
}
