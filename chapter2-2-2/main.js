// 16x16のセルを作成し配列に格納されている色を描画する
let canvas = null
let drawColorInput = null
const PIXEL_SIZE = 16
const CANVAS_SIZE = 16
// 16x16のピクセルを格納する2次元配列
const pixelData = new Array(PIXEL_NUM)
for (let i = 0; i < PIXEL_NUM; ++i) {
  pixelData[i] = new Array(PIXEL_NUM).fill('cccccc')
}

// クリック時にカラーピッカーで選択されている色を出力する。
function init() {
  const drawColorInput = document.getElementById('draw-color')
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    console.log(`描画色は${drawColorInput.value}です。`)
  })
  drawCanvas()
}

// 各セルを描画
function drawCanvas() {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < PIXEL_NUM; ++y) {
    for (let x = 0; x < PIXEL_NUM; ++x) {
      ctx.fillStyle = '#' + pixelData[x][y]
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)      
    }
  }
}