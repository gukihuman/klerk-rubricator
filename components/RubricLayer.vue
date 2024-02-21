<template>
    <ul>
        <li v-for="(rubric, i) in rubrics" :key="i">
            <div class="flex p-[1px]">
                <!-- fold / unfold arrow-like button -->
                <button
                    v-if="rubric.children && rubric.children.length"
                    @click="isOpen[i] = !isOpen[i]"
                    class="w-6 h-6 mr-2 text-slate-600 cursor-pointer rounded-md hover:bg-slate-400 transition ease-in-out duration-75"
                >
                    <SvgChevronRight v-show="!isOpen[i]" />
                    <SvgChevronDown v-show="isOpen[i]" />
                </button>
                <div v-else class="w-6 h-6 mr-2"></div>

                <!-- title and counts line -->
                <div class="flex w-full justify-between">
                    <p
                        @click="openLink(rubric.url)"
                        class="hover:text-blue-600 cursor-pointer transition ease-in-out duration-75"
                    >
                        {{ rubric.title }}
                    </p>
                    <div class="flex items-center">
                        <p>{{ `${rubric.count} (${rubric.countSum})` }}</p>
                        <input
                            type="checkbox"
                            @click="handleCheckClick($event, i)"
                            class="w-4 h-4 ml-2 accent-slate-500"
                        />
                    </div>
                </div>
            </div>

            <RubricLayer
                v-show="rubric.children && isOpen[i]"
                :rubrics="rubric.children"
                class="ml-6"
            />
        </li>
    </ul>
</template>
<script setup lang="ts">
import type { Rubric } from "./Rubricator.vue"

const props = defineProps({
    rubrics: { type: Object as PropType<Rubric[]>, default: [] },
})
const isOpen: Ref<boolean[]> = ref([])

onMounted(() => {
    for (let i = 0; i < props.rubrics.length; i++) {
        isOpen.value.push(false)
    }
})
const openLink = (url: string) => {
    window.open("https://www.klerk.ru" + url, "_blank")
}
const handleCheckClick = (event: MouseEvent, i: number) => {
    const target = event.target as HTMLInputElement
    if (target) props.rubrics[i].isSelected = target.checked
}
</script>
