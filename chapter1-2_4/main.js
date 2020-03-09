// 16x16のセルを作成し配列に格納されている色を描画する
let canvas = null
const PIXEL_SIZE = 16
const CANVAS_SIZE = 16
// 16x16のピクセルを格納する2次元配列
const pixelData = new Array(CANVAS_SIZE)
for (let i = 0; i < CANVAS_SIZE; ++i) {
  pixelData[i] = new Array(CANVAS_SIZE).fill('cccccc')
}

// クリック時にカラーピッカーで選択されている色を出力する。
function init() {
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    const pixelX = Math.floor(event.offsetX / PIXEL_SIZE)
    const pixelY = Math.floor(event.offsetY / PIXEL_SIZE)
    if (document.getElementById('pen-tool').checked) {
      executePenTool(pixelX, pixelY)
    } else {
      executeFillTool(pixelX, pixelY)
    }
    drawCanvas()
  })
  drawCanvas()
}

// ペンツール実行
function executePenTool(pixelX, pixelY) {
  const drawColorInput = document.getElementById('draw-color')
  pixelData[pixelX][pixelY] = drawColorInput.value.replace('#', '')
}

// 塗りつぶしツール実行
function executeFillTool(pixelX, pixelY) {
  const drawColorInput = document.getElementById('draw-color')
  var historySet = new Set()
  var srcColor = pixelData[pixelX][pixelY]
  var dstColor = drawColorInput.value.replace('#', '')
  // クリックされた座標を起点に、上下左右に再帰的に塗りつぶし
  fillRecursive(pixelX, pixelY, srcColor, dstColor, historySet)
}

function fillRecursive(pixelX, pixelY, srcColor, dstColor, historySet) {
  // 範囲外チェック
  if (pixelX < 0 || pixelX >= CANVAS_SIZE || pixelY < 0 || pixelY >= CANVAS_SIZE) {
    return
  }
  // すでに処理済み
  const cellKey = `${pixelX}_${pixelY}`
  if (historySet.has(cellKey)) {
    return
  }
  historySet.add(cellKey)
  // 塗りつぶし対象ではない
  if (pixelData[pixelX][pixelY] !== srcColor) {
    return
  }
  // 現在のピクセルに色を塗る
  pixelData[pixelX][pixelY] = dstColor  
  // 上下左右のピクセルも処理
  fillRecursive(pixelX + 1, pixelY, srcColor, dstColor, historySet)
  fillRecursive(pixelX - 1, pixelY, srcColor, dstColor, historySet)
  fillRecursive(pixelX, pixelY + 1, srcColor, dstColor, historySet)
  fillRecursive(pixelX, pixelY - 1, srcColor, dstColor, historySet)
}

// 各セルを描画
function drawCanvas() {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < CANVAS_SIZE; ++y) {
    for (let x = 0; x < CANVAS_SIZE; ++x) {
      ctx.fillStyle = '#' + pixelData[x][y]
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)      
    }
  }
}