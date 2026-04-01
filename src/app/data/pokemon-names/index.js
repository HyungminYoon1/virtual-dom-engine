import en from './en.js';
import ko from './ko.js';
import ja from './ja.js';
import zh from './zh.js';
import es from './es.js';

export const POKEMON_NAMES_BY_LOCALE = {
  en,
  ko,
  ja,
  zh,
  es,
};

export function getLocalPokemonName(locale, number) {
  const key = String(number).padStart(3, "0");
  return POKEMON_NAMES_BY_LOCALE[locale]?.[key] ?? POKEMON_NAMES_BY_LOCALE.en[key] ?? null;
}
