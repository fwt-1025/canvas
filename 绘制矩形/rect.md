## 绘制矩形的两种方式
- fillRect(x, y, width, height) , canvas提供的直接绘制矩形的方法, 可以通过设置fillStyle 的颜色，直接为矩形填充颜色。
    - x 目标的x坐标
    - y 目标的y坐标
    - width 目标的宽度
    - height 目标的高度

    ```js
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ff0000'
        ctx.fillRect(20,20,100, 100) // 打开浏览器会在浏览器上的20, 20位置上画出一个100 * 100的红色矩形
    ```

- strokeRect(x, y, width, height) 描边一个矩形
    - x 目标的x坐标
    - y 目标的y坐标
    - width 目标的宽度
    - height 目标的高度

    ```js
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#ff0000'
        ctx.strokeRect(200,200,100, 100) // 打开浏览器会在浏览器上的200, 200位置上画出一个100 * 100的红色边框的矩形


- rect(x, y, width, height) , 属于路径绘制，需要调用fill， stroke来为矩形填充颜色，描边。
    - x 目标的x坐标
    - y 目标的y坐标
    - width 目标的宽度
    - height 目标的高度
    ```js
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#0000ff'
        ctx.beginPath() // 开始路径绘制
        ctx.rect(100, 100, 100, 100) // 在100， 100位置上绘制一个 100 * 100的矩形
        ctx.fill() // 为矩形填充颜色，并结束当前绘制
    ```