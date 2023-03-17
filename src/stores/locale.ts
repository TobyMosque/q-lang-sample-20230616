import { defineStore } from 'pinia';
import { Quasar } from 'quasar';
import { ref } from 'vue';
import type { QSsrContext } from '@quasar/app-vite';

import {
  defaultLocale,
  Locales,
  quasarTranslationPackages,
  supportedLanguages,
} from 'src/i18n';

type LocaleStore = ReturnType<typeof useLocaleStore>;
export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locales>(defaultLocale);
  const detected = ref<Locales>();

  function detectLocaleInner(ssrContext?: QSsrContext | null): Locales {
    let languages: string[];
    if (process.env.SERVER) {
      languages = (ssrContext?.req.headers['accept-language'] || '')
        .split(',')
        .map((locale) => {
          const parts = locale.split(';');
          return {
            lang: parts[0],
            q: parts.length > 1 ? parseFloat(parts[1].substring(2)) : 1,
          };
        })
        .sort((a, b) => b.q - a.q)
        .map((item) => item.lang);
    } else {
      languages = [...window.navigator.languages];
    }

    for (const locale of languages) {
      const matchedLanguage = supportedLanguages.find(
        (lang) => locale.substring(0, 2) === lang.substring(0, 2)
      );
      if (matchedLanguage !== undefined) {
        return matchedLanguage;
      }
    }
    return defaultLocale;
  }

  function detectLocale(
    this: LocaleStore,
    ssrContext?: QSsrContext | null
  ): Locales {
    if (!detected.value) {
      detected.value = detectLocaleInner(ssrContext);
    }
    return detected.value || defaultLocale;
  }

  async function setLocale(
    this: LocaleStore,
    lang: Locales,
    ssrContext?: QSsrContext | null
  ) {
    locale.value = lang;
    await this.setQuasarLang(ssrContext);
  }

  async function setQuasarLang(
    this: LocaleStore,
    ssrContext?: QSsrContext | null
  ) {
    const _lang = await quasarTranslationPackages[
      `../../node_modules/quasar/lang/${locale.value}.mjs`
    ]();
    Quasar.lang.set(_lang.default, ssrContext);
  }

  return {
    locale,
    detected,
    detectLocale,
    setLocale,
    setQuasarLang,
  };
});
