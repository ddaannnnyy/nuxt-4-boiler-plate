# Components

Components are reusable pieces of the user interface. They are automatically imported by nuxt into any .vue file in your project. 

```js
<template>
    <CustomComponent />
</template>

<script setup lang="ts">
 // no import here!
</script>
```

Nuxt will serve components by default as named by their folder path.
e.g.

```bash
-----------------------
 /components
    /UI
       /Button
            /Light
                Foo.vue
------------------------
```
will be called as 
`<UIButtonLightFoo />`

```bash
-----------------------
 /components
    /UI
       /Button
            /Light
                index.vue
------------------------
```
will be called as 
`<UIButtonLight />`


You can remove this default feature in the Nuxt Config if required

```js
// nuxt.config.ts

export default defineNuxtConfig({
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});
```

This will revert the functionality to be more like Nuxt 2.

```bash
-----------------------
 /components
    /UI
       /Button
            /Light
                index.vue
------------------------
```
will be called as 
`<Light />`

However, I don't recommend this. The ease of a shorter name comes at a great cost of transparency.

I also don't recomment components _not_ in a folder. e.g.

```bash
Do!
-----------------------
 /components
    /UI
        /Button
            index.vue
        /Menu
            index.vue
------------------------

Even Better!
-----------------------
 /components
    /UI
        /Button
            UIButton.vue
        /Menu
            UIMenu.vue
------------------------

Do Not!
-----------------------
 /components
    /UI
       Button.vue
       Menu.vue
------------------------
```
all of these components will be called with `<UIButton />` and `<UIMenu />` however, creating components at their _root_ level impacts your ability to have related files stored together.

```bash
Do!
-----------------------
 /components
    /UI
       /Button
            index.vue
            index.story.ts
            index.test.ts
        /Menu
            index.vue
            index.story.ts
            index.test.ts
------------------------

Do Not!
-----------------------
 /components
    /UI
        Button.vue
        Button.story.ts
        Button.test.ts
        Menu.vue
        Menu.story.ts
        Menu.test.ts
------------------------
```
