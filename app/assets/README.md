# Assets

The /assets directory is for content that the build tool will process, but do not need to be available reliably after build.

Examples of files that would use this directory:
- Stylesheets
- Font files

Examples of files that should _not_ use this directory:
- Any files that are served from your server after build (specifically images, videos, audio, etc.)
- Any files in which you require a static url.

Nuxt will not serve files from the /assets directory as static files.

``` js
    <img src="~/assets/img/nuxt.png" alt="Nuxt" />
```
will be rendered to the client on an ethereal url, it will not be available at example.com/assets/img/nuxt.png

For files in which you require static and predicable URLs. Use the /public directory.