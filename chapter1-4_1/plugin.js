// プラグイン製作者に提供するインターフェース群
function getCanvasSize() {
  return CANVAS_SIZE
}

function getPixelColor(x, y) {
  return pixelData[x][y]
}

function setPixelColor(x, y, color) {
  pixelData[x][y] = color
  drawCanvas()
}