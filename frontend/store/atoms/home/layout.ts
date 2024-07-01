import { atom } from "recoil";

interface LayoutState {
    sidebarOpen: boolean;
}

export const LayoutStateAtom = atom<LayoutState>({
    key: "layoutState",
    default: {
        sidebarOpen: true,
    },
});