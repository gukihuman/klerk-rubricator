<template>
    <div class="w-[800px] bg-slate-300 p-8 text-lg min-h-[75px]">
        <div v-if="isFetched">
            <div class="flex justify-between italic mb-2">
                <div class="flex items-center">
                    <p>Отображать пустые рубрики</p>
                    <input
                        type="checkbox"
                        @click="handleAllowEmptyCheckClick($event)"
                        class="w-4 h-4 ml-2 accent-slate-500"
                    />
                </div>
                <p>{{ `Выбрано: ${selectedSum}` }}</p>
            </div>
            <div class="flex flex-row">
                <!-- fold / unfold arrow-like button -->
                <button
                    @click="isOpen = !isOpen"
                    class="w-6 h-6 mr-2 text-slate-600 cursor-pointer rounded-md hover:bg-slate-400 transition ease-in-out duration-75"
                >
                    <SvgChevronRight v-show="!isOpen" />
                    <SvgChevronDown v-show="isOpen" />
                </button>

                <div class="w-full">
                    <div class="flex justify-between">
                        <p>Рубрики</p>
                        <p>{{ `(${resolveRootCountSum})` }}</p>
                    </div>
                    <RubricLayer
                        v-if="allowEmpty && isOpen"
                        :rubrics="rootRubricsAllowEmpty"
                    />
                    <RubricLayer
                        v-if="!allowEmpty && isOpen"
                        :rubrics="rootRubrics"
                    />
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
const rootRubricsAllowEmpty = ref<Rubric[]>([])

const rootCountSum = ref(0)
const rootCountSumAllowEmpty = ref(0)

// Array of boolean that corresponds to rubrics
const isOpen: Ref<boolean> = ref(false)

const isFetched = ref(false)
const allowEmpty = ref(false)

const selectedSum = ref(0)

const resolveRootRubrics = computed(() => {
    return allowEmpty.value ? rootRubricsAllowEmpty.value : rootRubrics.value
})
const resolveRootCountSum = computed(() => {
    return allowEmpty.value ? rootCountSumAllowEmpty.value : rootCountSum.value
})

onMounted(async () => {
    rootRubrics.value = await $fetch("/api/getRubrics")
    rootCountSum.value = addFrontendProps(rootRubrics.value)

    rootRubricsAllowEmpty.value = await $fetch("/api/getEmptyRubrics")
    rootCountSumAllowEmpty.value = addFrontendProps(rootRubricsAllowEmpty.value)

    isFetched.value = true

    // TODO: remove (data understanding and debugging)
    console.log("rootRubrics:", rootRubrics.value)
    console.log("rootRubricsAllowEmpty:", rootRubricsAllowEmpty.value)
})
watch(
    rootRubrics,
    () => (selectedSum.value = calcSelectedSum(rootRubrics.value)),
    { deep: true }
)
watch(
    rootRubricsAllowEmpty,
    () => (selectedSum.value = calcSelectedSum(rootRubricsAllowEmpty.value)),
    { deep: true }
)

/** Mutates given array of rubrics. Creates isSelected and countSum properties
 * for each rubric. countSum = original count + countSum of all rubric's
 * children. Returns sum of countSum properties of all rubrics of given array. */
const addFrontendProps = (rubrics: Rubric[]): number => {
    let childrenCountSum = 0
    for (let i = 0; i < rubrics.length; i++) {
        rubrics[i].isSelected = false

        if (rubrics[i].children) {
            const countSum =
                rubrics[i].count + addFrontendProps(rubrics[i].children)

            childrenCountSum += countSum
            rubrics[i].countSum = countSum
        } else {
            childrenCountSum += rubrics[i].count
            rubrics[i].countSum = rubrics[i].count
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
        if (rubrics[i].children) {
            selectedSum += calcSelectedSum(rubrics[i].children)
        }
    }
    return selectedSum
}
const handleAllowEmptyCheckClick = async (event: MouseEvent) => {
    const target = event.target as HTMLInputElement
    if (target.checked) allowEmpty.value = true
    else allowEmpty.value = false

    resetIsSelected(rootRubrics.value)
    resetIsSelected(rootRubricsAllowEmpty.value)
}
/** Reset isSelected for all rubrics */
const resetIsSelected = (rubrics: Rubric[]) => {
    for (let i = 0; i < rubrics.length; i++) {
        rubrics[i].isSelected = false
        if (rubrics[i].children) resetIsSelected(rubrics[i].children)
    }
}
</script>
