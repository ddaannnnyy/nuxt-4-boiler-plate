# Layouts
Layouts are reusable page frames, with slots in which the page "component" will be loaded into.

They work like layouts, it's pretty standard.

An interesting note is that layouts are one of the only areas in which you can't use index as the base file. Instead you use default.vue.

Layouts are also a good place for setup logic that you want to run on a page load, regardless of which page is actually loaded. For example, you can put each page in a `/blog/` page directory, and load information regardless of which specific page the user loads into, without having to duplicate code. 

Make sure that the `app.vue` is set up correctly with the `<NuxtLayout>` component.

```ts
// App.vue
<template>
    <NuxtLayout> // the layout template is loaded here
        <NuxtPage /> // the page template is loaded into the layout slot here
    </NuxtLayout>
    <p>Hello! I will be on every page, regardless of the page or layout.</p>
</template>
```

Each page will default to a default.vue layout if it's available. 

You can override this behaviour by assigning a layout to the `definePageMeta` on the page that you'd like to override.

```ts
<script setup lang="ts">
definePageMeta({
    layout: 'login', // /layouts/login.vue OR /layouts/login/index.vue must exist
    ...otherMetaProperties
});
</script>
```