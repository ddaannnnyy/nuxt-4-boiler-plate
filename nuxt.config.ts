// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    public: {
      publicVariable: process.env.PUBLIC_VARIABLE,
    },
    private: {
      privateVariable: process.env.PRIVATE_VARIABLE,
    }
  },

  modules: ['@pinia/nuxt']
})