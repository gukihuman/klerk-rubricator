<template>
    <div v-for="(rubric, index) in rubrics" :key="index">
        <div>{{ rubric.title }}</div>
        <RubricLayer v-if="rubric.children" :rubrics="rubric.children" />
    </div>
    <div v-if="rubrics.length"></div>
</template>
<script setup lang="ts">
import type { Rubric } from "./Rubricator.vue"
const props = defineProps({
    rubrics: { type: Object as PropType<Rubric[]>, default: [] },
})
</script>
