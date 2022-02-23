class Canvas {
    constructor (el, width, height) {
        this.canvas = document.querySelector('#' + el)
        this.canvas.width = width || window.innerWidth
        this.canvas.height = height || window.innerHeight
        this.ctx = this.canvas.getContext('2d')
        this.canvasObjects = []
    }
    add (shape) {
        shape.draw(this.ctx, this.canvas)
        this.canvasObjects.push(shape)
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

export default Canvas