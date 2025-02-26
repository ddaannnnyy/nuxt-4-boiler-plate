// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  // Most of the configuration options in here are overriding the defaults or setting options 
  // external modules. The modules have their options in the documentation usually.
  // for example, you can extend .nuxt/tsconfig.json here
  typescript: {
    tsConfig: {
      "compilerOptions": {},
    },
  },

  // accessed through the useRuntimeConfig() composable
  // const runtime = useRuntimeConfig();
  // console.log(runtime.public.publicVariable)
  runtimeConfig: {
    public: {
      publicVariable: process.env.PUBLIC_VARIABLE,
    },
    // any variables NOT in the public directory are ONLY available in the server
    private: {
      privateVariable: process.env.PRIVATE_VARIABLE,
    }
  },

  // usually if you use npx to add modules they are automatically added to the modules array
  // if you use local modules or decide to add them with yarn, you'll have to manually register them here.
  modules: ['@pinia/nuxt']
})