import Shape from "./Shape";
export default class Polygon extends Shape {
    constructor(pos) {
        super(pos)
        this.type = 'polygon'
        this.instance_id = -1
    }
    initUpdate(pos) {
        // this.points = this.points.length > 1
        //     ? this.points.splice(this.points.length - 1, 1, pos)
        //     : this.points.push(pos)
        let arr = this.points.length > 1 ? this.points.slice(0, this.points.length - 1) : this.points
        arr.push(pos)
        this.points = arr
    }
    draw(canvas) {
        const ctx = canvas.ctx
        let width = canvas.canvas.width
        let height = canvas.canvas.height
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = this.opacity
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle
        this.points.forEach((item, index) => {
            if (index === 0) ctx['moveTo'](item.x * width, item.y * height)
            else ctx['lineTo'](item.x * width, item.y * height)
        })
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
        ctx.restore()
    }
    getData () {
        return {
            cls: this.cls,
            clsName: this.clsName,
            color: this.color,
            id: this.id,
            instance_id: this.instance_id,
            points: this.points.map(item => [item.x, item.y]),
            tags: this.tags,
            type: this.type
        }
    }
    update (index, pos) {
        this.points[index] = pos
    }
    isPointInPath (ctx, point) {
        let index = super.isPointInPath(ctx, point) // 判断编辑状态下是否点击了图形顶点
        if (index >= 0) {
            return index
        }
        // 如果没有点击到图形顶点，就要判断该点是否点在了图形内
        // let x = point.x
        // let y = point.y
        ctx.beginPath()
        this.points.forEach((item, index) => {
            if (index === 0) ctx['moveTo'](item.x, item.y)
            else ctx['lineTo'](item.x, item.y)
        })
        if (ctx.isPointInPath(point.x, point.y)) {
            return 999
        } else {
            return -1
        }
        ctx.closePath()
    }
}