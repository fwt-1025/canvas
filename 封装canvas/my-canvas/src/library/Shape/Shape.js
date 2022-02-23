import { getContextWH } from '../utils/position-transfer'
import store from '../../vuex'
export default class Shape {
    constructor () {
        this.points = []
        this.lineWidth = 1
        this.strokeStyle = "#000"
        this.fillStyle = "#f00"
        this.opacity = .5
        this.editStrokeStyle = "rgba(255, 255, 255, 1)"
        this.editFillStyle = "#00f"
        this.editOpacity = 1
        this.centerX = 0
        this.centerY = 0
        // 公共数据保存属性
        this.tags = []
        this.cls = ''
        this.clsName = ''
        this.color = ''
        this.id = Math.random().toString().split(".")[1]
    }
    drawPoints(canvas) {
        const ctx = canvas.ctx
        this.points.forEach(item => {
            ctx.save()
            // ctx.setTransform(store.state.mat)
            ctx.beginPath()
            ctx.strokeStyle = this.editStrokeStyle
            // ctx.fillStyle = this.editFillStyle
            ctx.rect(item.x - 4, item.y - 4, 8, 8)
            // ctx.fill()
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        })
    }
    isPointInPath(ctx, pos) {
        for (var i = 0; i < this.points.length; i++) {
            let item = this.points[i]
            // ctx.beginPath()
            // ctx.rect(item.x - 10, item.y - 10, 20, 20)
            // console.log('鼠标点的坐标', pos.x , pos.y)
            // if (ctx.isPointInPath(pos.x, pos.y)) {
            //     return i
            // }
            if (pos.x > item.x - 4 && pos.x < item.x + 4 && pos.y < item.y + 4 && pos.y > item.y - 4) {
                return i
            }
            // ctx.closePath()
            // ctx.restore()
        }
    }
    move(ctx, ms, es) { // 移动暂时有问题
        let mx = es.x - (this.centerX ? this.centerX : es.x)
        let my = es.y - (this.centerY ? this.centerY : es.y)
        for (let i = 0; i < this.points.length; i++) {
            let item = this.points[i]
            let px = item.x + mx
            let py = item.y + my
            if (px < 0) {
                mx = 0
            }
            if (py < 0) {
                my = 0
            }
            this.points[i]={x: item.x + mx, y: item.y + my }
        }
        this.centerX = es.x
        this.centerY = es.y
    }
}