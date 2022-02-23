import Shape from "./Shape"
import { getContextWH } from '../utils/position-transfer'
import store from '../../vuex'
export default class Rect extends Shape {
    constructor (pos) {
        super(pos)
        this.type = 'box'
    }
    draw(canvas) {
        const ctx = canvas.ctx
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = this.opacity
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle
        ctx.rect(this.points[0].x, this.points[0].y, (this.points[2].x - this.points[0].x), (this.points[2].y - this.points[0].y))
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    getData() {
        this.x = this.points[0].x
        this.y = this.points[0].y
        this.width = this.points[2].x - this.x
        this.height = this.points[2].y - this.y
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            type: this.type,
            cls: this.cls,
            clsName: this.clsName,
            tags: this.tags,
            color: this.color,
            points: this.points
        }
    }
    initUpdate(start, end) {
        // this.centerX = (end.x - start.x) / 2
        // this.centerY = (end.y - start.y) / 2
        this.points[0] = {
            x: start.x,
            y: start.y
        }
        this.points[1] = {
            x: end.x,
            y: start.y
        }
        this.points[2] = {
            x: end.x,
            y: end.y
        }
        this.points[3] = {
            x: start.x,
            y: end.y
        }
    }
    isPointInPath (ctx, point) {
        let index = super.isPointInPath(ctx, point) // 判断编辑状态下是否点击了图形顶点
        if (index >= 0) {
            return index
        }
        // 如果没有点击到图形顶点，就要判断该点是否点在了图形内
        let x = point.x
        let y = point.y
        let left = this.points[0].x
        let top = this.points[0].y
        let width = this.points[2].x - left
        let height = this.points[2].y - top
        if (x > left && y > top && x < left + width && y < top + height) {
            return 999
        } else {
            return -1
        }
    }
    update(index, pos) {
        let prev = index - 1 < 0 ? 3 : index - 1
        let next = index + 1 == 4 ? 0 : index + 1
        // if (index + 1 === 4) {
        //     index = 0
        // } else if (index - 1 < 0) {
        //     index = 3
        // }
        let px = this.points[index].x - pos.x
        let py = this.points[index].y - pos.y
        if (index === 1 || index === 3) {
            this.points[prev] = {x: this.points[prev].x, y: this.points[prev].y + -py}
            this.points[next] = {x: this.points[next].x + -px, y: this.points[next].y}
        } else {
            this.points[next] = {x: this.points[next].x, y: this.points[next].y + -py}
            this.points[prev] = {x: this.points[prev].x + -px, y: this.points[prev].y}
        }
        this.points[index] = pos
    }
}