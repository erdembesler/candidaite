// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { defineNuxtPlugin } from '#app';

// Import theme configuration
import theme from '../config/theme';

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    ssr: true,
    theme: {
      options: { customProperties: true },
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            ...theme,
          },
        },
        dark: {
          colors: {
            ...theme,
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
