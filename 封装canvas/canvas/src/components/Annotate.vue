<template>
    <div class="">
        <canvas id="canvas"></canvas>
        <img src="" id="image" alt="">
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
let drawing = ref(false)
let dragstatus = false

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
                "x": 0.22833333333333333,
                "y": 0.4791666666666667
            },
            {
                "x": 0.3675,
                "y": 0.4791666666666667
            },
            {
                "x": 0.3675,
                "y": 0.6549479166666666
            },
            {
                "x": 0.22833333333333333,
                "y": 0.6549479166666666
            }
        ]
    },
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
    }]
}]
const mousePosition = { x: 0, y: 0 }
// let image = new Image()
onMounted(() => {
    canvas = new Canvas('canvas', 1200, 768)
    canvas.canvas.addEventListener('mousedown', handleMouseDown)
    // setTimeout(_ => {
    drawBg(canvas.ctx)
    canvas.canvas.addEventListener('contextmenu', e => {
        e.preventDefault()
    })
    document.querySelector("#image").src = initData[0].imgUrl
    initData[0].regions.forEach(item => {
        if (item.type === 'box') {
            let rect = new Rect(item.points[0])
            Object.keys(item).forEach(ite => {
                rect[ite] = item[ite]
            })
            canvas.canvasObjects.push(rect)
        }
    })
    drawAll()
    canvas.canvas.addEventListener('mousewheel', e => {
        let scale
        if (e.wheelDelta > 0) {
            scale = 1 + 0.2 * -1
        } else {
            scale = 1 + 0.2 * 1
        }
        const { left, top } = canvas.canvas.getBoundingClientRect()
        mousePosition.x = e.clientX - left
        mousePosition.y = e.clientY - top
        let img = document.querySelector('#image')
        mat.translate(mousePosition.x, mousePosition.y).scaleU(scale)
        if (mat.a > 2) mat.scaleU(2 / mat.a)
        if (mat.a < 0.05) mat.scaleU(0.05 / mat.a)
        mat.translate(-mousePosition.x, -mousePosition.y)
        let leftTop = mat.clone().inverse().applyToPoint(0, 0)
        let bottomRight = mat.clone().inverse().applyToPoint(canvas.canvas.width, canvas.canvas.height)
        img.style.transform = `translate(${leftTop.x}px, ${leftTop.y}px)`
        img.style.width = bottomRight.x - leftTop.x + 'px'
        img.style.height = bottomRight.y - leftTop.y + 'px'
        let matrixnormal = mat.inverse()
        canvas.ctx.save()
        canvas.ctx.transform(matrixnormal.a, matrixnormal.b, matrixnormal.c, matrixnormal.d, matrixnormal.e, matrixnormal.f)
        drawBg(canvas.ctx)
        drawAll()
        canvas.ctx.restore()
    })
    // }, 1000)
})
// const chooseTool = (tool) => {
//     data.tool = tool
//     drawing.value = true
// }
const createFactory = (tool, pos) => {
    switch (tool) {
        case 'create-polygon':
            return new Polygon(pos)
        case 'create-rect':
            return new Rect(pos)
    }
}
const handleMouseDown = (e) => {
    console.log(e.button, store.state.selectTool)
    ms = windowToDevice({ x: e.clientX, y: e.clientY }, canvas)
    if (e.button === 2) {
        mvpos = {
            x: e.clientX - canvas.canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.canvas.getBoundingClientRect().top
        }
        canvas.canvas.style.cursor = 'grab'
        dragstatus = true
        canvas.canvas.addEventListener('mousemove', handleMouseMove)
        canvas.canvas.addEventListener('mouseup', handleMouseUp)
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
            canvas.canvasObjects.push(activeShape)
            canvas.canvas.addEventListener('mousemove', handleMouseMove)
            if (store.state.selectTool === 'create-polygon')
                activeShape.initUpdate(ms)
            else canvas.canvas.addEventListener('mouseup', handleMouseUp)
        }
    } else if (store.state.selectTool === 'drag') {
        console.log('drag')
    } else {
        for (let i = 0; i < canvas.canvasObjects.length; i++) {
            let item = canvas.canvasObjects[i]
            if ((index = item.isPointInPath(canvas.ctx, ms)) > -1) {
                if (index === 999) {
                    canvas.canvas.style.cursor = 'grab'
                } else {
                    canvas.canvas.style.cursor = 'crosshair'
                }
                activeShape = item
                break
            }
        }
        console.log('activeShape', activeShape)
        canvas.canvas.addEventListener('mousemove', handleMouseMove)
        canvas.canvas.addEventListener('mouseup', handleMouseUp)
    }
}
const handleMouseMove = (e) => {
    es = windowToDevice({ x: e.clientX, y: e.clientY }, canvas)
    if (dragstatus) {
        let ms = mvpos
        mvpos = {
            x: e.clientX - canvas.canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.canvas.getBoundingClientRect().top
        }
        let img = document.querySelector('#image')
        mat.translate(mvpos.x - ms.x, mvpos.y - ms.y)
        let leftTop = mat.clone().inverse().applyToPoint(0, 0)
        img.style.transform = `translate(${-leftTop.x}px, ${-leftTop.y}px)`
        canvas.ctx.save()
        canvas.ctx.setTransform(mat.clone())
        drawBg(canvas.ctx)
        drawAll()
        canvas.ctx.restore()
    }
    console.log(activeShape)
    if (activeShape) {
        if (index > -1) {
            if (index === 999) {
                console.log(999)
                activeShape.move(canvas.ctx, ms, es)
            } else {
                activeShape.update(index, es)
            }
        } else if (store.state.selectTool === 'create-polygon') {
            activeShape.initUpdate(es)
        } else {
            activeShape.initUpdate(ms, es)
        }
        drawBg(canvas.ctx)
        drawAll()
    }
}
const handleMouseUp = () => {
    canvas.canvas.style.cursor = 'auto'
    // activeShape.centerX = 0
    // activeShape.centerY = 0
    activeShape = null
    index = -1
    dragstatus = false
    console.log(dragstatus)
    canvas.canvas.removeEventListener('mouseup', handleMouseUp)
    canvas.canvas.removeEventListener('mousemove', handleMouseMove)
}

const drawBg = (ctx) => {
    canvas.clear()
    // ctx.drawImage(image, 0, 0, canvas.canvas.width, canvas.canvas.height)
}

const drawAll = () => {
    canvas.canvasObjects.forEach((item) => {
        item.draw(canvas)
        item.drawPoints(canvas)
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
            emit('changestore.state.selectTool', '')
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
</style>