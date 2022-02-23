<template>
    <div>
        <div
            v-for="item in toolbarArr"
            :key="item.value"
            class="tool-bar"
            @click="chooseSelectTool(item)"
        >
            <span :class="['iconfont', item.icon, store.state.selectTool === item.value && 'active-tool']"></span>
        </div>
    </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const emit = defineEmits(['select-tool'])
let data = reactive({
    activeTool: '',
    toolbarArr: [
        {
            icon: 'icon-select',
            value: 'select'
        },
        {
            icon: 'icon-hand',
            value: 'drag'
        },
        {
            icon: 'icon-search',
            value: 'scale'
        },
        {
            icon: 'icon-tag',
            value: 'tag'
        },
        {
            icon: 'icon-huajuxing_0',
            value: 'create-rect'
        },
        {
            icon: 'icon-draw-polygon',
            value: 'create-polygon'
        },
        {
            icon: 'icon-line',
            value: 'create-line'
        }
    ]
})
const chooseSelectTool = (item) => {
    data.activeTool = item.value
    store.commit('CHANGE_SELECT_TOOL', item.value)
}
const { toolbarArr, activeTool } = toRefs(data)
</script>

<style scoped>
.tool-bar{
    width: 40px;
    height: 60px;
    text-align: center;
    line-height: 60px;
}
.tool-bar span{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
.active-tool{
    color:aqua;
    background: #000;
}
</style>