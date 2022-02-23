<template>
    <div class="">
        <canvas id="canvas"></canvas>
        <canvas id="annotate-toolbox"></canvas>
        <!-- <img src="" id="image" alt=""> -->
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Canvas from '../library/Canvas'
import Rect from '../library/Shape/Rect'
import Polygon from '../library/Shape/Polygon'
import {
    windowToDevice,
    windowToCanvas,
    deviceToWindow,
} from '../library/utils/position-transfer'

import Matrix from '../library/matrix'

const store = useStore()

const mat = new Matrix()

let activeShape
let index
let ms
let es
let mvpos = {x: 0, y: 0}
let canvas
let canvasTool
let drawing = ref(false)
let dragstatus = false
let data = reactive({
    img: new Image()
})
let imgScale = 1
let imgX = 0
let imgY = 0
let minScale = 0.5

let baseScale = 1


let flag = true
/*
    {
        "x": 0.41833333333333333,
        "y": 0.4856770833333333,
        "w": 0.18500000000000005,
        "h": 0.2838541666666667,
        "type": "box",
        "cls": "",
        "clsName": "",
        "tags": [],
        "color": "",
        "points": [
            {
                "x": 0.41833333333333333,
                "y": 0.4856770833333333
            },
            {
                "x": 0.6033333333333334,
                "y": 0.4856770833333333
            },
            {
                "x": 0.6033333333333334,
                "y": 0.76953125
            },
            {
                "x": 0.41833333333333333,
                "y": 0.76953125
            }
        ]
    }*/
let initData = [{
    imgUrl: "http://10.192.0.179:28080/group1/image/20210906/20/27/1/20210408170049-0001.jpg",
    regions: [{
        "x": 0.22833333333333333,
        "y": 0.4791666666666667,
        "w": 0.13916666666666666,
        "h": 0.17578124999999994,
        "type": "box",
        "cls": "",
        "clsName": "",
        "tags": [],
        "color": "",
        "points": [
            {
                "x": 0.22833333333333333 * 1200,
                "y": 0.4791666666666667 * 700
            },
            {
                "x": 0.3675 * 1200,
                "y": 0.4791666666666667 * 700
            },
            {
                "x": 0.3675 * 1200,
                "y": 0.6549479166666666 * 700
            },
            {
                "x": 0.22833333333333333 * 1200,
                "y": 0.6549479166666666 * 700
            }
        ]
    }]
}]
// let image = new Image()
onMounted(() => {
    canvas = new Canvas('canvas', 1200, 768)
    canvasTool = new Canvas('annotate-toolbox', 1200, 768)
    canvasTool.canvas.addEventListener('mousedown', handleMouseDown)
    // setTimeout(_ => {
    // drawBg(canvas.ctx)
    canvasTool.canvas.addEventListener('contextmenu', e => {
        e.preventDefault()
    })
    data.img.src = initData[0].imgUrl
    // document.querySelector("#image").src = initData[0].imgUrl
    // data.img = document.querySelector("#image")
    initData[0].regions.forEach(item => {
        if (item.type === 'box') {
            let rect = new Rect(item.points[0])
            Object.keys(item).forEach(ite => {
                rect[ite] = item[ite]
            })
            canvasTool.canvasObjects.push(rect)
        }
    })
    data.img.onload = function () {
        // data.img.width = 1200
        // data.img.height = 700
        minScale = imgScale = 1200 / this.width
        store.commit('SET_SCALE', imgScale)
        drawBg(canvas.ctx)
        changeCanvasScaleAndPos()
        drawAll()
    }
    canvasTool.canvas.addEventListener('mousewheel', e => {
        var pos = windowToCanvas ({x: e.clientX, y: e.clientY}, canvas.canvas);
            // e.wheelDelta = e.wheelDelta ? e.wheelDelta : (e.deltalY * (-40));  //获取当前鼠标的滚动情况
        var newPos = {x:((pos.x-imgX)/imgScale).toFixed(2) , y:((pos.y-imgY)/imgScale).toFixed(2)};
        if (e.wheelDelta > 0) {// 放大
                imgScale +=0.05;
                imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
                imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
        } else {//  缩小
            imgScale -=0.05;
            if(imgScale<minScale) {//最小缩放1
                imgScale = minScale;
            }
            imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
            imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
            // console.log(imgX,imgY);
        }
        store.commit('SET_SCALE', imgScale)
        store.commit('SET_OFFSET', {
            x: imgX,
            y: imgY
        })
        // canvasTool.ctx.save()
        baseScale = imgScale / minScale
        changeCanvasScaleAndPos()
        // canvasTool.ctx.restore()
        drawBg(canvas.ctx)
        drawAll()
    })
})
const createFactory = (tool, pos) => {
    switch (tool) {
        case 'create-polygon':
            return new Polygon(pos)
        case 'create-rect':
            return new Rect(pos)
    }
}
const handleMouseDown = (e) => {
    ms = windowToCanvas({ x: e.clientX, y: e.clientY }, canvasTool.canvas)
    ms = {
        x: (ms.x - imgX) / baseScale,
        y: (ms.y - imgY) / baseScale
    }
    if (e.button === 2) {
        mvpos = {
            x: e.clientX - data.img.getBoundingClientRect().left,
            y: e.clientY - data.img.getBoundingClientRect().top
        }
        dragstatus = true
        canvasTool.canvas.addEventListener('mousemove', handleMouseMove)
        canvasTool.canvas.addEventListener('mouseup', handleMouseUp)
        return
    }
    // console.log(store.state.selectTool.includes('create'))
    if (store.state.selectTool.includes('create')) {
        if (activeShape && store.state.selectTool == 'create-polygon') {
            let arr = activeShape.points.slice(0, activeShape.points.length)
            arr.push(ms)
            activeShape.points = arr
            return
        }
        if (store.state.selectTool.includes('create')) {
            activeShape = createFactory(store.state.selectTool, ms)
            canvasTool.canvasObjects.push(activeShape)
            canvasTool.canvas.addEventListener('mousemove', handleMouseMove)
            if (store.state.selectTool === 'create-polygon')
                activeShape.initUpdate(ms)
            else canvasTool.canvas.addEventListener('mouseup', handleMouseUp)
        }
    } else if (store.state.selectTool === 'drag') {
        console.log('drag')
    } else {
        console.log(canvasTool.canvasObjects)
        for (let i = 0; i < canvasTool.canvasObjects.length; i++) {
            let item = canvasTool.canvasObjects[i]
            if ((index = item.isPointInPath(canvasTool.ctx, ms)) > -1) {
                if (index === 999) {
                    canvasTool.canvas.style.cursor = 'grab'
                } else {
                    canvasTool.canvas.style.cursor = 'crosshair'
                }
                activeShape = item
                break
            }
        }
        // console.log('activeShape', activeShape)
        canvasTool.canvas.addEventListener('mousemove', handleMouseMove)
        canvasTool.canvas.addEventListener('mouseup', handleMouseUp)
    }
}

const handleMouseMove = (e) => {
    es = windowToCanvas({ x: e.clientX, y: e.clientY }, canvasTool.canvas)
    es = {
        x: (es.x - imgX) / baseScale,
        y: (es.y - imgY) / baseScale
    }
    if (dragstatus) {
        canvasTool.canvas.style.cursor = 'grab'
        var x = es.x - ms.x;
        var y = es.y - ms.y;
        // ms = es;
        imgX  = imgX + x;
        imgY  = imgY + y;
        changeCanvasScaleAndPos()
        drawBg(canvas.ctx)
        drawAll()
        // canvas.ctx.restore()
    }
    if (activeShape) {
        if (index > -1) {
            if (index === 999) {
                console.log(999)
                // activeShape.move(canvasTool.ctx, ms, es)
            } else {
                activeShape.update(index, es)
            }
        } else if (store.state.selectTool === 'create-polygon') {
            activeShape.initUpdate(es)
        } else {
            activeShape.initUpdate(ms, es)
            console.log(ms, es, es.x / baseScale, es.y / baseScale, baseScale, imgScale)
        }
        drawBg(canvas.ctx)
        drawAll()
    }
}
const handleMouseUp = () => {
    canvasTool.canvas.style.cursor = 'auto'
    // activeShape.centerX = 0
    // activeShape.centerY = 0
    activeShape = null
    index = -1
    dragstatus = false
    console.log(dragstatus)
    canvasTool.canvas.removeEventListener('mouseup', handleMouseUp)
    canvasTool.canvas.removeEventListener('mousemove', handleMouseMove)
}

const drawBg = (ctx) => {
    canvas.clear()
    canvasTool.clear()
    ctx.drawImage(
        data.img, //规定要使用的图像、画布或视频。
        0, 0, //开始剪切的 x 坐标位置。
        data.img.width, data.img.height,  //被剪切图像的高度。
        imgX, imgY,//在画布上放置图像的 x 、y坐标位置。
        data.img.width * imgScale, data.img.height * imgScale  //要使用的图像的宽度、高度
    );
}

const changeCanvasScaleAndPos = () => {
    canvasTool.ctx.setTransform(baseScale, 0, 0, baseScale, imgX, imgY)
    // canvasTool.ctx.restore()
    // canvasTool.canvas.style.transform = `scale(${baseScale}) translate(${imgX}px, ${imgY}px)`
    // console.log(canvasTool.canvas.style.transform)
}

const drawAll = () => {
    canvasTool.canvasObjects.forEach((item) => {
        item.draw(canvasTool)
        item.drawPoints(canvasTool)
    })
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (activeShape && store.state.selectTool === 'create-polygon') {
            activeShape.points = activeShape.points.slice(
                0,
                activeShape.points.length - 1
            )
            drawBg(canvas.ctx)
            drawAll(canvas.ctx)
            activeShape = null
            drawing.value = false
            canvas.canvas.removeEventListener('mouseup', handleMouseUp)
        }
        activeShape = null
        drawing.value = false
    }
    if (e.key === 's') {
        let data = canvas.canvasObjects.map(item => {
            return item.getData()
        })
        console.log(data)
    }
    if (e.key === 'r') {
        baseScale = 1
        imgScale = minScale
        imgX = 0
        imgY = 0
        drawBg(canvas.ctx)
        changeCanvasScaleAndPos()
        drawAll()
    }
    if (e.key === 'v') {
        store.commit('CHANGE_SELECT_TOOL', 'select')
    }
})
</script>

<style>
#image{
    width: 1200px;
    height: 768px;
    position: absolute;
    top: 0;
    left: 0;
}
#canvas{
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
}
#annotate-toolbox{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
}
</style>