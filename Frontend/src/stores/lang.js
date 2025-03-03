import { atom } from 'nanostores'

export const SupportedLangs = atom(["fr","en"])
export const DefaultLang = SupportedLangs.get().at(0) // fr


