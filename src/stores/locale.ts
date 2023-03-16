import { QSsrContext } from '@quasar/app-vite';
import { defineStore } from 'pinia';
import { Quasar } from 'quasar';
import { ref } from 'vue';

const langList = import.meta.glob(
  '../../node_modules/quasar/lang/(de|en-US|es|fr|pt-BR).mjs'
);

type LocaleStore = ReturnType<typeof useLocaleStore>;
export type Locales = 'de' | 'en-US' | 'es' | 'fr' | 'pt-BR';
export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locales>('en-US');
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
      switch (true) {
        case locale.startsWith('de'):
          return 'de';
        case locale.startsWith('en'):
          return 'en-US';
        case locale.startsWith('es'):
          return 'es';
        case locale.startsWith('fr'):
          return 'fr';
        case locale.startsWith('pt'):
          return 'pt-BR';
      }
    }
    return 'en-US';
  }

  function detectLocale(
    this: LocaleStore,
    ssrContext?: QSsrContext | null
  ): Locales {
    if (!detected.value) {
      detected.value = detectLocaleInner(ssrContext);
    }
    return detected.value || 'en-US';
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
    const _lang = await langList[
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
