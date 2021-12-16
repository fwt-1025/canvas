const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
console.log(ctx)

ctx.fillStyle = '#f00'
ctx.font = "bold 14px Arial"
ctx.fillText('第一种fillRect', 100, 80)
ctx.fillRect(100,100,100,100)

ctx.fillStyle = "#00f"
ctx.strokeStyle = "#0f0"
ctx.lineWidth = 10
ctx.beginPath()
ctx.fillText("第二种rect", 100, 300)
ctx.rect(100, 320, 300, 300)
ctx.stroke() // 描边
ctx.fill() // 填充颜色

ctx.fillStyle = '#f00'
ctx.fillText('第三种clearRect', 220, 420)
ctx.clearRect(220, 440, 50, 50) // 在120， 340的位置 清除一个50 * 50 的矩形

ctx.fillText('第四种strokeRect', 500, 480)
ctx.strokeRect(500, 500, 100, 100) // 在300 300的位置 描边一个100 * 100的矩形