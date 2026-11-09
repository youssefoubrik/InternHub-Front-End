import { create } from "zustand";

interface ProfileEditLockState {
  activeEditor: string | null;
  acquire: (editorId: string) => boolean;
  release: (editorId: string) => void;
  reset: () => void;
}

export const useProfileEditLockStore = create<ProfileEditLockState>((set, get) => ({
  activeEditor: null,
  acquire: (editorId) => {
    if (get().activeEditor) return false;
    set({ activeEditor: editorId });
    return true;
  },
  release: (editorId) => {
    if (get().activeEditor === editorId) set({ activeEditor: null });
  },
  reset: () => set({ activeEditor: null }),
}));
