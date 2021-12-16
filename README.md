### Canvas

- 绘制矩形
    - fillRect   填充矩形
    - strokeRect 描边矩形
    - clearRect  清除矩形
    - rect       绘制矩形路径


- 圆
    - arc        绘制圆的路径 (x, y, radius, startAngle, endAngle, anticlockwise)
    - arcTo      绘制圆弧 (x, y, x1, y1, radius)


- 线
    - lineTo     连线到某个位置 (x, y)
    - moveTo     将笔移动到某个位置 (x, y)


- 路径path 与线 圆等共用
    - beginPath  路径上下文开始， 开始绘制路径
    - closePath  关闭路径
    > 注： 绘制完路径需要关闭路径，否则下面的绘制会与之前的绘制连接在一起。


- 二次贝塞尔曲线
    - quadraticCurveTo(cp1x, cp1y, x, y) cp1x, cp1y 是第一个控制点， x, y为结束点
    - bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) cp1x, cp1y 是第一个控制点， cp2x, cp2y是第二个控制点， x, y为结束点
    ![Canvas_curves](./images/Canvas_curves.png)
    上图中红色点位控制点， 蓝色点为开始点和结束点

- 绘制样式和颜色
    - fillStyle 填充的颜色， 可以是十六进制颜色， 英文颜色， rgb， hsl， rgba, 渐变色。
    - strokeStyle 描边颜色， 可以是十六进制颜色， 英文颜色， rgb， hsl， rgba， 渐变色。
    - globalAlpha 全局透明度 取值范围 0 - 1
    - lineWidth  线宽
    - lineCap    线末端的样式 butt round square
    - lineJoin   线条与线条结合处的样式 miter round bevel 
    - miterLimit 限制当两条线相交时，交接处的最大长度，所谓交接处的长度（斜接长度）是指先调交接处内角顶点到外角顶点的长度。
    - getLineDash 返回一个包含当前虚线样式，长度为非负偶数的数组
    - setLineDash 设置当前虚线样式
    - lineDashOffset 设置虚线的起始偏移量。

    
- 渐变 Gradients
    - createLinearGradient(x1, y1, x2, y2)创建线性渐变, 方法接受 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。
    - createRadialGradient(x1, y1, r1, x2, y2, r2) 创建径向渐变, 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
    - addColorStop(position, color) 设置颜色， position取值为0-1之间的数值， color为一个有效的css颜色值。
