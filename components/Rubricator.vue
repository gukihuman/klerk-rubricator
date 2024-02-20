<template>
    <div class="w-[800px] bg-slate-300 p-5 text-lg min-h-[75px]">
        <div v-if="isFetched" class="flex flex-row">
            <!-- fold / unfold arrow-like button -->
            <div
                @click="isOpen = !isOpen"
                class="w-6 h-6 mr-2 text-slate-600 cursor-pointer rounded-md hover:bg-slate-400 transition ease-in-out duration-75"
            >
                <SvgChevronRight v-show="!isOpen" />
                <SvgChevronDown v-show="isOpen" />
            </div>

            <div class="w-full">
                <p>Рубрики</p>
                <RubricLayer v-if="isOpen" :rubrics="rootRubrics" />
            </div>
        </div>
        <SvgRolling v-else />
    </div>
</template>
<script setup lang="ts">
export type Rubric = {
    children: Rubric[]
    count: number
    countSum: number // frontend only
    id: number
    title: string
    url: string
}
const rootRubrics = ref<Rubric[]>([])
const isOpen: Ref<boolean> = ref(false)
const isFetched = ref(false)
onMounted(async () => {
    rootRubrics.value = await $fetch(
        "https://www.klerk.ru/yindex.php/v3/event/rubrics"
    )
    calcChildrenCountSum(rootRubrics.value)
    isFetched.value = true

    // TODO: remove (data understanding and debugging)
    console.log(rootRubrics.value)
})

/** Mutates given array of rubrics. Creates countSum property for each rubric which is its own original count + countSum of all its children. Returns sum of countSum properties of all rubrics of given array. */
const calcChildrenCountSum = (rubrics: Rubric[]): number => {
    let childrenCountSum = 0
    for (let i = 0; i < rubrics.length; i++) {
        // Check length too because sometimes children exist but it's empty
        if (rubrics[i].children && rubrics[i].children.length) {
            rubrics[i].countSum =
                rubrics[i].count + calcChildrenCountSum(rubrics[i].children)
            childrenCountSum += rubrics[i].countSum
        } else {
            childrenCountSum += rubrics[i].count
        }
    }
    return childrenCountSum
}
</script>
