export default defineEventHandler((event) => {
    // with SSR page loads will run through this middleware as their requested. So make sure to early return if not routing to an /api
    if (!event.path.startsWith('/api')) return;
    
    // server console logs are printed to the server terminal, not the browser.
    console.log('greetings from the server route', event.path);
    return;
});