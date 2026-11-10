import { create } from "zustand";
import { Student } from "@/types/types";

interface StudentProfileDraftState {
  draft: Student | null;
  setDraft: (draft: Student | null) => void;
  updateDraft: (update: (draft: Student) => Student) => void;
  resetDraft: () => void;
}

export const useStudentProfileDraftStore = create<StudentProfileDraftState>(
  (set) => ({
    draft: null,
    setDraft: (draft) => set({ draft }),
    updateDraft: (update) =>
      set((state) => ({
        draft: state.draft ? update(state.draft) : null,
      })),
    resetDraft: () => set({ draft: null }),
  })
);
