import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly i18n: I18nGlobal;
  }
}

type I18nGlobal = ReturnType<typeof createI18nInternal>['global'];
function createI18nInternal() {
  return createI18n({
    locale: 'en-US',
    legacy: false,
    messages,
    globalInjection: true,
  });
}

export default boot(({ app, store }) => {
  const i18n = createI18nInternal();

  // Set i18n instance on app
  app.use(i18n);
  store.use(() => ({ i18n: i18n.global }));
});
