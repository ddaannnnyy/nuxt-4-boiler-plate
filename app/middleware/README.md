# Middleware

Nuxt runs middleware before the movement of the VueRouter.
It occurs after the `onBeforeUnMount` lifecycle.

Middleware can intercept directions, but on happy path it should return void.

Using the `.global.ts` suffix will run the middleware automatically before every page route.

```ts
// /middleware/auth.global.ts
// Because this is global, it will run automatically on every
// router movement.
defineNuxtMiddleware((to, from) => {
    // early return if the user is directed to /login or /logout
    if (to.fullPath === '/login') return;
    if (to.fullPath === '/logout') return;

    // wait to load any data in the middleware until after the early returns, we want to keep this thin.
    const user = isUserLoggedIn();

    if (!user) {
        // if the user isn't logged in abort the navigation and
        // direct the user to the login page.
        navigateTo('/login');
    } else return;
});
```

for custom middleware you can define the middleware required on the pagemeta, just like the layouts. The middleware will run when entering or exiting this page. 
