import { atom } from "recoil";

export const errorAtom = atom({
    key : "error",
    default : {
        //contains all presently open roomIds
        error : null
    }
})