'use client'

import { create } from 'zustand'

export type ModalType = 'CONFIRM_LOGOUT'

export type ModalData = Record<string, unknown>

type Modal = {
  type: ModalType
  data?: ModalData
}

type ModalState = {
  modals: Modal[]
  openModal: (type: ModalType, data?: ModalData) => void
  closeModal: (type: ModalType) => void
  closeAllModals: () => void
  isModalOpen: (type: ModalType) => boolean
  getModalData: (type: ModalType) => ModalData | undefined
}

const useModal = create<ModalState>((set, get) => ({
  modals: [],
  openModal: (type, data = {}) => set((state) => ({ modals: [...state.modals, { type, data }] })),
  closeModal: (type) => set((state) => ({ modals: state.modals.filter((m) => m.type !== type) })),
  closeAllModals: () => set({ modals: [] }),
  isModalOpen: (type) => get().modals.some((m) => m.type === type),
  getModalData: (type) => get().modals.find((m) => m.type === type)?.data,
}))

export default useModal
