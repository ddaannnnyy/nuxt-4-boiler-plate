<template>
    <div>
        <p>
            An Error Occured
        </p>
        <pre>{{ props.error }}</pre>
        <p>For some reason the error prop doesn't always hydrate on the first render, to see the full error refresh this
            page.</p>
        <NuxtLink to="/">Go back to the dashboard</NuxtLink>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        error: Object as () => NuxtError
    });

    console.log(props.error);

</script>

<style scoped></style>