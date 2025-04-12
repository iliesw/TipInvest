import { atom } from 'nanostores'

export const SupportedLangs = ["fr","us"]
export const SelectedLang = atom("us")


export function Next(){
    const currentIndex = SupportedLangs.indexOf(SelectedLang.get())
    const nextIndex = (currentIndex + 1) % SupportedLangs.length
    SelectedLang.set(SupportedLangs[nextIndex])
    SelectedLang.notify()
}