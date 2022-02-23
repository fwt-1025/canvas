export const windowToDevice = (pos, canvas) => {
    // 转设备像素 并 变换为Veterx 2
    return {
        x: (pos.x - canvas.canvas.getBoundingClientRect().left) / canvas.canvas.width,
        y: (pos.y - canvas.canvas.getBoundingClientRect().top) / canvas.canvas.height
    }
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