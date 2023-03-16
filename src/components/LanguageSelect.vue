<template>
  <q-select
    v-bind="_props"
    v-model="modelValue"
    :label="t('language')"
    :options="options"
  >
    <template v-for="(_, slot) in _slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" :key="slot" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" :to="getRoute(scope.opt.value)">
        {{ scope.opt.label }}
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useLocaleStore } from 'src/stores/locale';
import { computed, useSlots, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import type { QSelectProps, QSelectSlots } from 'quasar';
import type { Locales } from 'src/boot/i18n';

export interface LanguageSelectProps
  extends Omit<QSelectProps, 'options' | 'label' | 'modelValue'> {
  standout?: boolean;
  emitValue?: boolean;
  mapOptions?: boolean;
}

const { t, locale } = useI18n();
const route = useRoute();

const attrs = useAttrs();
const localeStore = useLocaleStore();
const slots = useSlots() as never as QSelectSlots;
const _slots = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { option, ..._slots } = slots;
  return _slots;
});

const props = withDefaults(defineProps<LanguageSelectProps>(), {
  standout: true,
  emitValue: true,
  mapOptions: true,
});

const _props = computed(() => ({ ...attrs, ...props }));
const options = computed(() => [
  { value: 'de', label: t('german') },
  { value: 'en-US', label: t('english') },
  { value: 'es', label: t('spanish') },
  { value: 'fr', label: t('french') },
  { value: 'pt-BR', label: t('portuguese') },
]);

function getRoute(val: Locales) {
  return {
    name: route.name as string,
    params: {
      ...route.params,
      lang: val,
    },
    query: route.query,
    replace: true,
  };
}

const modelValue = computed({
  get() {
    return (route.params.lang as Locales) || localeStore.detected;
  },
  async set(val: Locales) {
    await localeStore.setLocale(val);
    locale.value = localeStore.locale;
  },
});
</script>
