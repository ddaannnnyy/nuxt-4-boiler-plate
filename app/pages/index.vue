<template>
    <div class="container">
        <h1>This is an example page</h1>
        <p>This example page displays how the Nuxt concepts display in the browser, but the source code in the <code>/app/pages/index.vue</code> has more comprehensive explainations.</p>
        <!-- Using refs in the DOM -->
        <section id="ref-examples">
            <div class="count-container">
                <p>The count is currently {{ count }}</p>
                <button
                class="count-button"
                @click="count++">
                    increment
                </button>
                <button
                class="count-button"
                @click="count--">
                    decrement
                </button>
                <p>The Count Halved is {{ halvedCount }}</p>
                <input type="text" ref="focusRef">
                <button
                @click.prevent="focusRef?.focus()"
                >Click to focus the text box, using it's ref.</button>
            </div>
        </section>

        <section id="component-example">
            <div class="component-container">
                <Example :count="count" @emit-label="updateCount" />
            </div>
        </section>

        <section id="naviation-example">
            <h2>Navigation</h2>
            <NuxtLink to="/nested/route">Go to another page</NuxtLink>
            <p>Why am I using the NuxtLink component instead of an anchor?</p>
            <p><code>NuxtLink</code> offers a fair few benefits, including pre-fetching, and better cache control.</p>
            <p>While you can use it externally with the <code>external</code> and <code>targer</code> props I usually just use it for internal navigation. External Links use old school anchor tags.</p>
        </section>


        <section id="directive-example">
            <h2>Directive Examples</h2>
            <h3>Shorthands</h3>
            <p>Nuxt provides shorthands of particular directives that you're much more likely to see, but they're directives under the hood.</p>
            <p>The most common are: </p>
            <ul>
                <p>Please not when you're reading these in the source code. The directives in the list here are just text, they are non-functional</p>
                <li>
                    <code>v-on</code>
                    <div>
                        <p>button v-on:click="clickHandle"</p>
                        <p>button @click="clickHandle"</p>
                    </div>
                </li>
                <li>
                    <code>v-bind</code>
                    <div>
                        <p v-pre>img v-bind:src="src"</p>
                        <p>img :src="src"</p>
                        <p>img :src</p>
                    </div>
                </li>

            </ul>
            <h3>Conditional Classes</h3>
            <button
                @click="showBlueBox = !showBlueBox"
                class="toggle-button">Toggle Box Class</button>
            <div
             class="toggle-box"
             :class="showBlueBox ? 'blue' : ''"></div>

            <h3>V-Model</h3>
            <input 
            type="text" 
            v-model="vmodelText" 
            placeholder="type here to see the ref binding">
            <p>{{ vmodelText }}</p>

            <h3>V-If</h3>
            <!-- 
            In most cases you don't have to manually hande the event on HTML Inputs
            v-model does the heavy lifting for you. You can if you'd like to though.
            This example does both, but only v-model is necessary, so it's duplicating the change.
            This examples @change is janky but I just did it all in the template, this is not recommended for intermediate TS requirements. Just use a function...
            -->
            <select 
            name="animal-select" 
            id="animal-select"
            v-model="animalToggle"
            @change="(event: Event) => animalToggle = ((event.currentTarget as HTMLSelectElement).value as 'cat' | 'dog')"
            >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
            </select>
            <p>{{ animalToggle }}</p>
            <div class="animal-image-container">
                <!-- The difference between v-if and v-show is that:
                v-if adds or removed the element
                v-show toggles the display of an element
                So when you select a cat the dog <p> is hidden, but the image of the dog does not exist in the DOM.
                -->
                <img 
                v-if="animalToggle === 'dog'"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flat_Coated_Retriever_-_black.jpg/289px-Flat_Coated_Retriever_-_black.jpg" alt="dog-image-example">
                <img 
                v-else-if="animalToggle == 'cat'"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Felis_silvestris_-_July_2007-1.jpg/640px-Felis_silvestris_-_July_2007-1.jpg" alt="cat-image-example">
                <img 
                v-else
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Dog_and_Cat-Petsfriend.jpg/640px-Dog_and_Cat-Petsfriend.jpg" alt="dog-cat-image-fallback">
                <p
                v-show="animalToggle === 'dog'"
                >Check out this cool dog</p>
            </div>
            <h3>V-For</h3>
            <ul>
                <!-- 
                Because we're dynamically generating ids with crypto.UUID this list can cause a client/server mismatch
                the ids are undefined on the server, but UUIDs on the client. The best solution for this would be better architecture,
                but because it's sample data it's a good example of the ClientOnly composable, this part of the dom will not be rendered at all by the server.
                -->
                <ClientOnly>
                    <li
                    v-for="(item, index) in directiveListExample"
                    :key="item.id">
                        {{ `${index} - ${JSON.stringify(item)}` }}
                    </li>
                </ClientOnly>
            </ul>
            <h3>V-HTML</h3>
            <p>v-html allows you to inject dynamic HTML into a parent element.</p>
            <p>This is used sparingly because it can create XSS vulnerabilities, so don't v-html user input. It's mainly used for things like blog articles where the HTML is from a trusted WYSIWYG</p>
            <p v-html="htmlExample"></p>
        </section>
        <section id="server-api-example">
            <h2>Server API Example</h2>
            <p>Requests made to the Nuxt Server are visible in the Browser Network tab, however the calls made inside this API are hidden from the client</p>
            <form @submit.prevent="sendAPIRequest">
                <input type="text" v-model="githubUsername">
                <button>submit</button>
            </form>
            <pre>
                {{ serverRequestResponse }}
            </pre>
        </section>
    </div>
</template>

<script setup lang="ts">
    import type { GitHubProfile } from '~/../server/api/returnTest.post';
    import type { Simplify, SerializeObject } from 'nitropack'

    interface ListExample {
        id: string;
        label: string;
        value: string;
    };

    definePageMeta({
        name: 'Page Name'
    });

    const count = ref<number>(0);
    const focusRef = ref<HTMLInputElement | null>(null);
    const showBlueBox = ref<boolean>(false);
    const animalToggle = ref<'dog' | 'cat'>('cat');
    const htmlExample = ref<string>('<span style="color:red">hello, world</span>');
    const serverRequestResponse = ref<Simplify<SerializeObject<GitHubProfile> | null>>();
    const githubUsername = ref<string>('ddaannnnyy');
    // with no default this type is inferred as string | undefined, but IMO it's best to specifically define the type.
    const vmodelText = ref<string>();
    const directiveListExample = ref<ListExample[]>([
        {
            id: crypto.randomUUID(),
            label: 'List Item 1',
            value: 'list-item-1',
        },
        {
            id: crypto.randomUUID(),
            label: 'List Item 2',
            value: 'list-item-2',
        },
        {
            id: crypto.randomUUID(),
            label: 'List Item 3',
            value: 'list-item-3',
        },
    ]);

    // computed property example
    // by default computed refs are readonly
    const halvedCount = computed(() => count.value / 2);

    // if you need to make a writable ref, you can pass an object with a getter and a setter
    const plusOne = computed({
        get: () => count.value + 1,
        set: (val) => {
            count.value = val - 1;
        },
    });

    // I wrapped this so it doesn't error in the console.
    if (false) {
        // Cannot assign 'value' because it is a read-only property.
        halvedCount.value = 2; // 🚫

        // Can assign to value because we defined a setter.
        plusOne.value = 2; // ✅
    }

    // catch an emit example
    function updateCount(event: { newValue: number; }) {
        console.log('emit caught', event);
        count.value = event.newValue;
    };

    // API request to /server/api example
    async function sendAPIRequest() {

        // $fetch is provided by Nuxt and is just a straight wrapper over ofetch
        const request = await $fetch('/api/returnTest', {
            method: 'POST',
            body: {
                username: githubUsername.value
            },
            parseResponse: JSON.parse
        });
        serverRequestResponse.value = request;
    }

    // lifecycle example
    onMounted(() => {
        // basic composable example
        sayHello();
        // basic util example
        console.log(formatNumber(1234));
    });

    onBeforeRouteLeave(() => {
        console.log('catch ya later');
    });
</script>

<style scoped>
    /* styles in this scoped style tag will not escape the page */
    .container {
        display: flex;
        flex-flow: column nowrap;
        gap: 4px;
    }

    .count-button,
    .toggle-button {
        width: max-content;

    }

    .toggle-box {
        width: 100px;
        aspect-ratio: 1/1;
        border: 1px solid #000;
        background-color: blue;
    }

    .toggle-box:not(.blue) {
        background-color: red;
    }

    .animal-image-container {
        width: 150px;
        aspect-ratio: 1/1;
        object-fit: cover;
    }

    .animal-image-container > img {
        max-width: 100%;
    }
</style>