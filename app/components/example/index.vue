<template>
    <div class="component-body">
        <h2>Component Example</h2>
        <h3><code>/app/components/example/index.vue</code></h3>
        <p>The count being passed as a prop is: {{ count }}</p>
        <button
        @click="emitTest"
        >Emit to change the count to 10</button>
    </div>
</template>

<script setup lang="ts">
    interface EmitInterface {
        newValue: number;
    }

    const {count} = defineProps<{
        count: number
    }>();
    const emit = defineEmits<{
        'emit-label': [value: EmitInterface];
    }>();

    function emitTest() {
        emit('emit-label', { newValue: 10 });
    };
</script>

<style scoped>
.component-body {
    background-color: darkgray;
    padding: 2rem;
}
</style>