// 8x8のセルを作成し配列に格納されている色を描画する
let canvas = null
let drawColorInput = null
const CELL_SIZE = 32
const CELL_NUM = 8
const cellData = [
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc'],
  ['cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc', 'cccccc']
]

// クリック時にカラーピッカーで選択されている色を出力する。
function init() {
  canvas = document.getElementById('main-canvas')
  canvas.addEventListener('click', event => {
    const cellX = Math.floor(event.offsetX / CELL_SIZE)
    const cellY = Math.floor(event.offsetY / CELL_SIZE)
    if (document.getElementById('pen-tool').checked) {
      executePenTool(cellX, cellY)
    } else {
      executeFillTool(cellX, cellY)
    }
    drawCanvas()
  })
  drawCanvas()
}

// ペンツール実行
function executePenTool(cellX, cellY) {
  const drawColorInput = document.getElementById('draw-color')
  cellData[cellX][cellY] = drawColorInput.value.replace('#', '')
}

// 塗りつぶしツール実行
function executeFillTool(cellX, cellY) {
  const drawColorInput = document.getElementById('draw-color')
  var historySet = new Set()
  var srcColor = cellData[cellX][cellY]
  var dstColor = drawColorInput.value.replace('#', '')
  // クリックされた座標を起点に、上下左右に再帰的に塗りつぶし
  fillRecursive(cellX, cellY, srcColor, dstColor, historySet)
}

function fillRecursive(cellX, cellY, srcColor, dstColor, historySet) {
  // 範囲外チェック
  if (cellX < 0 || cellX >= CELL_NUM || cellY < 0 || cellY >= CELL_NUM) {
    return
  }
  // すでに処理済み
  const cellKey = `${cellX}_${cellY}`
  if (historySet.has(cellKey)) {
    return
  }
  historySet.add(cellKey)
  // 塗りつぶし対象ではない
  if (cellData[cellX][cellY] !== srcColor) {
    return
  }
  // 現在のピクセルに色を塗る
  cellData[cellX][cellY] = dstColor  
  // 上下左右のピクセルも処理
  fillRecursive(cellX + 1, cellY, srcColor, dstColor, historySet)
  fillRecursive(cellX - 1, cellY, srcColor, dstColor, historySet)
  fillRecursive(cellX, cellY + 1, srcColor, dstColor, historySet)
  fillRecursive(cellX, cellY - 1, srcColor, dstColor, historySet)
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