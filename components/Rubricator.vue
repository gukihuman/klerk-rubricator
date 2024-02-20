<template>
    <div>Рубрикатор</div>
    <RubricLayer :rubrics="rootRubrics" />
</template>
<script setup lang="ts">
export type Rubric = {
    children: Rubric[]
    count: number
    id: number
    title: string
    url: string
}
const rootRubrics = ref<Rubric[]>([])
onMounted(async () => {
    rootRubrics.value = await $fetch(
        "https://www.klerk.ru/yindex.php/v3/event/rubrics"
    )
    // TODO: remove (data understanding and debugging)
    console.log(rootRubrics.value)
})
</script>
