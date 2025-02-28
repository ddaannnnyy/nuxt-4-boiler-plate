# Server API Routes

Routes in the /server/api directory are automatically prefixed with /api

These pages export a default `defineEventHandler()`

The routes are managed by unjs/h3, and the preferred way to make fetch requests inside the server is $fetch, which is a wrapper for unjs/ofetch.

There is a lot to the Nuxt Server, so while I build out examples I recommend reading the documentation [directly](https://nuxt.com/docs/guide/directory-structure/server#route-parameters)