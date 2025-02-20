# Composables 

Composables are reusable functions that are globally autoimported into your `.vue`, `.ts`, and `.js` files.

The difference between a composable and a utility are really just up to best practice.

Usually a composable must answer *YES* to one of these questions:

- Does it use lifecycle hooks?
- Does it use Vue's reactivity?
- Is is reliant on another composable? 

If your function answers *YES* to any of these, then it's a composable.
Otherwise, it's a utility function and should be in the `/utils` directory.

Examples of composables

### Uses lifecycle hooks
```ts
export const useTimer: void = (callback: () => void, intervalMS: number = 1000) => {
    let timer: ReturnType<setInterval> | null = null;

    function clear() {
        if (!timer) return;

        clearInterval(timer);
        timer = null;
    }

    // Because we're using the mounted and before un-mounted hooks
    // this counts as a composable
    onMounted(() => {
        if (interval <= 0) return;
        timer = setInterval(callback, intervalMS);
    });

    onBeforeUnmount(() => {
        clear();
    })
}
```

### Uses Vue Reactivity
```ts
export const useEmailName: Ref<string> = (email: string) => {
    const emailPrefix = ref<string>(email);

    if (email.includes("+")) {
        // Edge case for gmail addresses with custom labels
        // e.g. dannhebdon+test@gmail.com
        // we only want to return dannhebdon
        emailPrefix.value = email.substring(0, email.indexOf("+"));
    } else emailPrefix.value = email.substring(0, email.indexOf("@"));
    
    return emailPrefix;
}
```

### Uses another composable (plus uses reactivity)
```ts
import defu from "defu";

export interface useCachedFetchOptions {
    ttl?: number;
    fetchOptions?: RequestInit;
    immediate?: boolean;
}

export function useCachedFetch<T>(url: string, options?: useCachedFetchOptions): CachedFetchReturn {
    const data = ref<T>();
    const error = ref<unknown>();
    const loading = ref<boolean>(false);
    const cache: CacheMap = useCache();
    const TEN_MINUTES = 1000 * 60 * 10;
    const internalOptions: useCachedFetchOptions = defu(options, {
        immediate: true,
        ttl: TEN_MINUTES,
        fetchOptions: {
            headers: {
                'Accept': 'application/json',
            },
        },
    }) as useCachedFetchOptions;

    async function fetchData(): void {
        loading.value = true;
        try {
            const cachedData = cache.getItem(url);
            if (cachedData) {
                data.value = cachedData;
            } else {
                const request = await fetch(url, internalOptions.fetchOptions);
                if (!request.ok) {
                    throw new Error(request.statusText);
                }
                data.value = await request.json();
                cache.setItem(url, data.value, internalOptions.ttl);
            }
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    function refresh(): void {
        cache.removeItem(url);
        fetchData();
    };

    if (internalOptions.immediate) {
        fetchData();
    }

    return { data, error, loading, execute: fetchData, refresh };
}
```
