# Pages

Pages contain the vue files that are used as pages. The easiest way to think of pages are as components, they're very similar. They're components mounted into the `<NuxtPage>` slot in the App.vue

The layout of the page is identical to that of components, the main difference are the composables used in setup. You also cannot use props or emits in the page "component"

```js
<template>
    <!--Page HTML Here-->
</template>

<script setup lang="ts">
definePageMeta({
    ...pageMeta,
});

defineRouteRules({
  prerender: true,
});

// The rest of your TS here.

</script>

<styles scoped>
/**
    Scoped CSS rules here
 */
</styles>
```

## Routes
```bash
/pages
    /about
        index.vue // example.com/about
    /contact
        /index.vue // example.com/contact
    /blog
        /news 
            index.vue // example.com/blog/news
        articles.vue // example.com/blog/articles
        [id].vue // example.com/blog/{{dynamic-route}}
    index.vue // example.com
```

The routes are automatically created based on the structure of your /pages folder.
Sub-folders are parsed to sub-routes automatically.

While you can name the pages the same way as components my naming best practice still applies.

Dynamic routes can be made with brackets in the name.

For example 

`/pages/blog/[id].vue` 

can be accessed at example.com/blog/1234

and the 1234 property of the url will be available in the page with the `useRoute()` built-in composable.

```js
// /pages/posts/[id].vue

<script setup lang="ts">
const route = useRoute();

// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id);
</script>

```

You can also chain then into strings for example

`/pages/person-dan/location-brisbane`

```js
// /pages/person-[name]/location-[area]

<script setup lang="ts">
const route = useRoute();

console.log(route.params.name); // dan
console.log(route.params.area); // brisbane
</script>

```

You can add optional segments with double square brackets

`/pages/person-[name]/location-[location]/[[color]].vue`

example.com/person-dan/location-brisbane/yellow ✓

example.com/person-dan/location-brisbane ✓

```js
// /pages/person-[name]/location-[area]/[[color]]
// example.com/person-dan/location-brisbane

<script setup lang="ts">
const route = useRoute();

console.log(route.params.name); // dan
console.log(route.params.area); // brisbane
console.log(route.params.color); // undefined

</script>

```

You can also use the spread operator on a property of the route as a catch-all for wildcard routes

```js
// /pages/person/[...slug].vue
// example.com/person/dan/brisbane/1234
<script setup lang="ts">
const route = useRoute();
console.log(route.params) // { slug: ['dan', 'brisbane', '1234'] }
</script>
```

```js
// /pages/person/[...slug].vue
// example.com/person
<script setup lang="ts">
const route = useRoute();
console.log(route.params) // { }
</script>
```

## Accessing in the template
There are 3 main ways to access the route in the template.
If you are using the route in your setup file you can use the
`const route = useRoute()` composable and simply reference it as a normal JS object in the template

```html
<template>
    <span>{{ route.name }}</span>
</template>
```

However, if you're not using the route in your setup you don't need to use the composable, you can access the route at any time with `$route`

```html
<template>
    <span>{{ $route.name }}</span>
</template>
```