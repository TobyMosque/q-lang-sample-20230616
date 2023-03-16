import { boot } from 'quasar/wrappers';
import { useLocaleStore } from 'src/stores/locale';

export default boot(async ({ store, ssrContext }) => {
  const localeStore = useLocaleStore(store);
  await localeStore.setQuasarLang(ssrContext);
});
