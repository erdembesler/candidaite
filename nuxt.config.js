import { defineNuxtConfig } from 'nuxt/config';


export default defineNuxtConfig({
    ssr: true, // Enable Server-Side Rendering
    app: {
      head: {
        title: 'Candidaite',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '' },
        ],
      },
    },
    styleResources: {
        sass: [
          '~vuetify/styles/main.sass',
        ],
        scss: [
          '~vuetify/styles/main.sass',
        ],
      },  
    css: [
      '~/styles/main.scss',
      'vuetify/styles',
      '@mdi/font/css/materialdesignicons.css'
    ],
    plugins: [
      '~/plugins/vuetify.js'
    ],
    components: true,
    buildModules: [
      // https://go.nuxtjs.dev/eslint
      '@nuxtjs/eslint-module',
      // https://go.nuxtjs.dev/tailwindcss
      '@nuxtjs/tailwindcss',
    ],
    build: {
      transpile: ['vuetify'],
    },
  });
  