<template>
    <div class="c-flex">
        <AnnotateTool></AnnotateTool>
        <AnnotateVue class="annotate"></AnnotateVue>
    </div>
</template>

<script setup>
import AnnotateVue from './components/Annotate.vue';
import AnnotateTool from './components/AnnotateTool.vue';
</script>

<style>
body{
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.c-flex{
    display: flex;
}
.annotate{
    position: relative;
    width: 1200px;
    height: 768px;
    overflow: hidden;
}
</style>