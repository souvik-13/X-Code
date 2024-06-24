import { atom } from "recoil";

export const explorerTabsAtom = atom<{ value: string; show: boolean; collapsed: boolean }[]>({
    key: "explorerTabs",
    default: [
        { value: "Folders", show: true, collapsed: false },
        { value: "Open Files", show: true, collapsed: false },
        // { value: "Search", show: true, collapsed: true}
    ],
});