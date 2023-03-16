<template>
  <q-page class="row items-center justify-evenly">
    {{ t('message') }} <q-date v-model="date"></q-date>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const date = '2023/03/16';
</script>
