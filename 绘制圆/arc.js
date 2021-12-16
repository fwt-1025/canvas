const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')

ctx.fillStyle = '#f00'

ctx.fillText('第一种arc 顺时针', 80, 80)
ctx.beginPath()
ctx.arc(100, 100, 50, 0, 1.5 * Math.PI, false)
ctx.stroke()
ctx.closePath()

ctx.fillText('第一种arc 逆时针', 180, 180)
ctx.beginPath()
ctx.arc(200, 200, 10, 0, 2 * Math.PI, true)
ctx.arc(200, 200, 50, 0, 1.5 * Math.PI, true) // 此处不结束路径绘制是因为更好的看出逆时针的方向
ctx.stroke()
ctx.closePath()


ctx.fillText('第二种 arcTo', 300, 300)
ctx.beginPath()
ctx.moveTo(300, 300)
ctx.arcTo(200, 300, 200, 250, 50); // 两个控制点的x, y, x1, y1, radius半径
ctx.stroke()