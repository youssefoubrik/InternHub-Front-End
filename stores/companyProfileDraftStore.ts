import { create } from "zustand";
import { Company } from "@/types/types";

interface CompanyProfileDraftState {
  draft: Company | null;
  setDraft: (draft: Company | null) => void;
  updateDraft: (update: (draft: Company) => Company) => void;
  resetDraft: () => void;
}

export const useCompanyProfileDraftStore = create<CompanyProfileDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  updateDraft: (update) => set((state) => ({
    draft: state.draft ? update(state.draft) : null,
  })),
  resetDraft: () => set({ draft: null }),
}));
