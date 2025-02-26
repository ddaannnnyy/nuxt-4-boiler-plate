# Stores

Nuxt uses stores to persist state application wide, while you can certainly write your own state with the `useState()` composable in your own composable but the recommended way is a 3rd party store management system called Pinia.

Pinia can be installed with npx as a module with 

`npx nuxi@latest module add pinia`

Pinia autoimports almost all of the composables that you use to interact with it, it feels very native.

## Defining the store

The store is returned in from the `defineStore()` composable. 

You can write Pinia stores in the Options API format, or the Composition API format. My recommendation is to start with the Options API as it's easier to read and then refactor when your complexity requires it.

Composition API Stores are much more flexible, they can support watchers and any other Nuxt composables, but their trade off is that they're harder to wrangle in SSR, and can become very difficult to read if not scaffolded properly. 

These examples will be written in the Options API by default, but here is the boilerplate of each for reference. They're also written in Javascript for brevity, but typically we write stores in Typescript. Pinia will infer types automatically, but I still prefer to manually create Interfaces for stores as they're easier to manage.

```js
// /stores/counterStore.ts

// While you can name the return of defineStore as whatever you like, it's best practice to 
// prefix your store with the word 'use'. 

// It's also best practice for your store to end in the word 'store'.
// userStore, preferenceStore, cartStore, etc.

// This name is used as the storeID and should be unique application-wide. It's the first arg.
// if using the Options API the second arg is an options object
export const useCounterStore = defineStore('counterStore', {
    // State are varibles that can be read or interacted with
    // In React these woult be the first index of the array returned by useState
    state: () => {
        count: 0,
        name: 'Dan',
        age: undefined 
        // for Nuxt to manage state variables they all must be defined, 
        // even if undefined as a default.
    },
    // Getters are computed properties and common mutation shorthands of the state.
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    // Actions are methods that are run on state.
    actions: {
        increment() {
            this.count++;
        },
    },
});

// if using the Composition API the second arg is a setup function
// State variables become Refs.
// Getter variables become Computed Properties.
// Actions become regular old functions. 
export const useCounterStore = defineStore('counterStore', () => {
    const count = ref(0);
    const name = ref('Dan');
    const doubleCount = computed(() => count.value * 2);

    function increment() {
        count.value++;
    };

    // NOTE! You must return all state properties in the setup function for them to be managed.
    // The only variables that should not be returned are variables that are used by,
    // but do not belong to the store. e.g. const route = useRote(). 
    // We would not return route.

    // You cannot have 'private' properties in state.
    // Variables that do not return become readonly, and will break DevTools and in SSR
    return { count, name, doubleCount, increment };
})

// This is an example with the store defined with an interface, easy peasy.
interface State {
    count: number;
    name: string;
    age?: number;
}

export const useCounterStore = defineStore('counterStore', {
    state: (): State => {
        count: 0,
        name: 'Dan',
        age: undefined 
        // it's still best practice to define all of the defaults.
        // even if the default is null or undefined.
    },
    getters: {
        doubleCount: (state): number => state.count * 2,
    },
    actions: {
        increment(): number {
            this.count++;
        },
    },
});

```

## Using the store

In the above file we defined the store, but it won't be created until we use it.

```js
<script setup lang="ts">
    // ✓ create a Reactive constant variable for the store
    const counterStore = useCounterStore();

    // ❌ Do not destructure state from the store
    // Destructuring will set count as a primitive type of int instead of a ref
    // This will beak reactivity
    const { count } = useCounterStore();

    // this WILL remail reactive as the computed composable will maintain reactivity, 
    // but you can just use store.doubleCount directly, so this is a redundancy.
    const doubleValue = computed(() => store.doubleCount);

</script>
```

## Actually accessing the state

Pinia offers a lot of composables for interacting with the store.

Here are the most common:

```js
<script setup lang="ts">
    // initialise the store
    const userStore = useUserStore();

    // accessing the state
    const name = ref<string>('');
    name.value = userStore.name;

    // updating a single data point in the state 
    userStore.age = 32;

    // updating multiple data points in the state
    userStore.$patch((state) => {
        state.name = 'Dan';
        state.age = 33;
        state.likes.push({
            hobby: 'cars',
            expensive: true,
        });
    });

    // You can replace the whole state
    // However, this just calls $patch internally, so you can just do that if you like
    userStore.$state = {
        ...userData,
    };

    // Subscribing to the state (triggers on a mutation)
    
    userStore.$subscribe((mutation, state) => {
        console.log(mutation.type); // 'direct' | 'patch object' | 'patch function'
        console.log(mutation.storeId); // 'userStore'
        console.log(mutation.payload); // only available with type === 'patch object' 
        // returns the object passed in the patch
        console.log(state) // the new state after the change
    }, 
    // $subscribe uses the Vue Watch under the hood so you can pass the watcher options as
    // optional args
    { 
        flush: 'sync',
        detatched: true,
    }
    );

    // Subscribing to the whole state

    watch(
        pinia.state, 
        (state) => {
            localStorage.setItem('piniaState', JSON.stringify(state));
        },
        { deep: true }
    );

    // Reset the store to the defaults
    userStore.$reset();
    

</script>
```

