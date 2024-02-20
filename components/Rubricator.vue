<template>
    <div>initial</div>
</template>
<script setup lang="ts">
onMounted(async () => {
    const fetchData = await $fetch(
        "https://www.klerk.ru/yindex.php/v3/event/rubrics"
    )
    console.log(fetchData)
})
</script>
