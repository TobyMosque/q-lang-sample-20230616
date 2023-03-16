<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { preFetch } from 'quasar/wrappers';
import { useLocaleStore } from 'src/stores/locale';
import { useI18n } from 'vue-i18n';
import type { Locales } from 'src/boot/i18n';

export default defineComponent({
  preFetch: preFetch(async ({ store, currentRoute, ssrContext, redirect }) => {
    let { name, params, query } = currentRoute;
    let locale = params.lang as Locales;
    const localeStore = useLocaleStore(store);
    locale ||= localeStore.detectLocale(ssrContext);
    await localeStore.setLocale(locale, ssrContext);

    if (!params.lang) {
      return redirect({
        name: name as string,
        params: { ...params, lang: locale },
        query,
      });
    }
  }),
});
</script>

<script setup lang="ts">
const { locale } = useI18n();
const localeStore = useLocaleStore();
locale.value = localeStore.locale;
</script>
