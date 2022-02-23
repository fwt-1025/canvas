export const windowToDevice = (pos, canvas) => {
    // 转设备像素 并 变换为Veterx 2
    return {
        x: (pos.x - canvas.canvas.getBoundingClientRect().left) / canvas.canvas.width,
        y: (pos.y - canvas.canvas.getBoundingClientRect().top) / canvas.canvas.height
    }
}

export const windowToCanvas = (pos, canvas) => {
    var box = canvas.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
    return {
        x: pos.x - box.left - (box.width - canvas.width) / 2,
        y: pos.y - box.top - (box.height - canvas.height) / 2
    };
}

export const deviceToWindow = (pos, canvas) => {
    // Veterx 2转为屏幕像素
    return {
        x: pos.x * canvas.canvas.width,
        y: pos.y * canvas.canvas.height
    }
}

export const getContextWH = (device) => {
    return {
        width: device.canvas.width,
        height: device.canvas.height
    }
}