import { getContextWH } from '../utils/position-transfer'
export default class Shape {
    constructor () {
        this.points = []
        this.lineWidth = 1
        this.strokeStyle = "#000"
        this.fillStyle = "#f00"
        this.opacity = .5
        this.editStrokeStyle = "rgba(0, 0, 255, 1)"
        this.editFillStyle = "#00f"
        this.editOpacity = 1
        this.deviceWidth = 0
        this.deviceHeight = 0
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
        const { width, height } = getContextWH(canvas)
        this.deviceWidth = width
        this.deviceHeight = height
        this.points.forEach(item => {
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = this.editStrokeStyle
            // ctx.fillStyle = this.editFillStyle
            ctx.rect(item.x * width - 4, item.y * height - 4, 8, 8)
            // ctx.fill()
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        })
    }
    isPointInPath(ctx, pos) {
        for (var i = 0; i < this.points.length; i++) {
            let item = this.points[i]
            ctx.save()
            ctx.beginPath()
            // ctx.strokeStyle = this.editStrokeStyle
            // ctx.fillStyle = this.editFillStyle
            ctx.rect(item.x * this.deviceWidth - 4, item.y * this.deviceHeight - 4, 8, 8)
            // ctx.fill()
            ctx.closePath()
            // ctx.stroke()
            if (ctx.isPointInPath(pos.x * this.deviceWidth, pos.y * this.deviceHeight)) {
                return i
            }
            ctx.restore()
        }
    }
    move(ctx, ms, es) { // 移动暂时有问题
        let mx = es.x - (this.centerX ? this.centerX : es.x)
        let my = es.y - (this.centerY ? this.centerY : es.y)
        // console.log(mx, my)
        // // this.centerX = this.centerX - mx
        // // this.centerY = this.centerY - my

        // // ctx.transform(1, 0, 0, 1, mx, my)
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
        // this.points.forEach((p,i)=>{
        //     let px = 0
        //     let py = 0
        //     this.points[i]={x: p.x + mx, y: p.y + my }
        //     if (p.x + mx <= 0) {
        //         mx = 0
        //         px = p.x + mx
        //         this.points[i]={x: 0, y: px}
        //     } else if (p.y + my <= 0) {
        //         my = 0
        //         py = p.x + my
        //         this.points[i]={x: py, y: 0}
        //     } else if (p.x + mx >= 1) {
        //         my = 0
        //         px = 1
        //         this.points[i]={x: 1, y: p.y}
        //     } else if (p.y + mx >= 1) {
        //         my = 0
        //         py = 1
        //         this.points[i]={x: p.x, y: 1}
        //     }
        //     // this.points[i]={x: px, y: py }
        // })
        this.centerX = es.x
        this.centerY = es.y
    }
}