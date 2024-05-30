import { atom } from "recoil";

export const roomsOpenAtom = atom({
    key : "roomsOpenAtom",
    default : {
        //contains all presently open roomIds
        roomsOpen : new Set()
    }
})