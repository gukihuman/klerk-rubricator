<template>
    <div class="w-[800px] bg-slate-300 p-5 text-lg min-h-[75px]">
        <div v-if="isFetched">
            <div class="flex justify-end italic">
                {{ `Выбрано: ${selectedSum}` }}
            </div>
            <div class="flex flex-row">
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
        </div>
        <SvgRolling v-else />
    </div>
</template>
<script setup lang="ts">
export type Rubric = {
    children: Rubric[]
    count: number
    id: number
    title: string
    url: string

    // Added at frontend
    countSum?: number
    isSelected?: boolean
}
const rootRubrics = ref<Rubric[]>([])
const rootCountSum = ref(0)
const isOpen: Ref<boolean> = ref(false)
const isFetched = ref(false)
const selectedSum = ref(0)
watch(
    rootRubrics,
    () => (selectedSum.value = calcSelectedSum(rootRubrics.value)),
    { deep: true }
)
onMounted(async () => {
    rootRubrics.value = await $fetch("/api/getRubrics")
    rootCountSum.value = addFrontendProps(rootRubrics.value)
    isFetched.value = true

    // TODO: remove (data understanding and debugging)
    console.log(rootRubrics.value)
})

/** Mutates given array of rubrics. Creates isSelected and countSum properties
 * for each rubric. countSum = original count + countSum of all rubric's
 * children. Returns sum of countSum properties of all rubrics of given array. */
const addFrontendProps = (rubrics: Rubric[]): number => {
    let childrenCountSum = 0
    for (let i = 0; i < rubrics.length; i++) {
        rubrics[i].isSelected = false

        // Check length because sometimes children array exist but it's empty
        if (rubrics[i].children && rubrics[i].children.length) {
            const countSum =
                rubrics[i].count + addFrontendProps(rubrics[i].children)

            childrenCountSum += countSum
            rubrics[i].countSum = countSum
        } else {
            childrenCountSum += rubrics[i].count
        }
    }
    return childrenCountSum
}

/** Calculates countSum of selected rubrics. */
const calcSelectedSum = (rubrics: Rubric[]): number => {
    let selectedSum = 0
    for (let i = 0; i < rubrics.length; i++) {
        if (rubrics[i].isSelected) {
            selectedSum += rubrics[i].countSum || rubrics[i].count
            continue
        }

        // Check length because sometimes children array exist but it's empty
        if (rubrics[i].children && rubrics[i].children.length) {
            selectedSum += calcSelectedSum(rubrics[i].children)
        }
    }
    return selectedSum
}
</script>
