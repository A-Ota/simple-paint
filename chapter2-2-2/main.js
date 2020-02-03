// 16x16のセルを作成し配列に格納されている色を描画する
let canvas = null
let drawColorInput = null
const CELL_SIZE = 16
const CELL_NUM = 16
// 16x16のピクセルを格納する2次元配列
const cellData = new Array(CELL_NUM)
for (let i = 0; i < CELL_NUM; ++i) {
  cellData[i] = new Array(CELL_NUM).fill('cccccc')
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
  for (let y = 0; y < CELL_NUM; ++y) {
    for (let x = 0; x < CELL_NUM; ++x) {
      ctx.fillStyle = '#' + cellData[x][y]
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)      
    }
  }
}