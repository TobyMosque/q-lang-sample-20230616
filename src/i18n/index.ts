// Important note: manually add new languages to to the quasarTranslationPackages glob string
import de from './de';
import en from './en-US';
import es from './es';
import fr from './fr';
import pt from './pt-BR';

export const defaultLocale = 'en-US';
const languages = {
  de: de,
  [defaultLocale]: en,
  es: es,
  fr: fr,
  'pt-BR': pt,
};
export const quasarTranslationPackages = import.meta.glob(
  '../../node_modules/quasar/lang/(de|en-US|es|fr|pt-BR).mjs'
);

export type Locales = keyof typeof languages;
export const supportedLanguages = Object.keys(languages) as Locales[];

export default languages;
