"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FullFormData } from "@/lib/schemas";

interface FormStore {
  currentStep: number;
  data: Partial<FullFormData>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setStep: (step: number) => void;
  updateData: (section: keyof FullFormData, data: Record<string, unknown>) => void;
  resetForm: () => void;
  isComplete: () => boolean;
}

const initialData: Partial<FullFormData> = {
  personal: undefined,
  income: undefined,
  expenses: undefined,
  assets: undefined,
  liabilities: undefined,
  superannuation: undefined,
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setStep: (step) => set({ currentStep: step }),
      
      updateData: (section, sectionData) => 
        set((state) => ({
          data: {
            ...state.data,
            [section]: sectionData,
          },
        })),
      
      resetForm: () => set({ currentStep: 1, data: initialData }),
      
      isComplete: () => {
        const { data } = get();
        return !!(
          data.personal &&
          data.income &&
          data.expenses &&
          data.assets &&
          data.liabilities &&
          data.superannuation
        );
      },
    }),
    {
      name: "aud-advisor-form",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
